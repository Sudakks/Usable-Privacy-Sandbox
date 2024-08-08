# -*- coding: utf-8 -*-

import os
import configparser
import openai
import warnings

from langchain.chains import LLMChain
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.prompts import PromptTemplate, FewShotPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from langchain.output_parsers import PydanticOutputParser
from dalle3 import Dalle
from openai import OpenAI


import json
from datetime import datetime
from random import randint
from collections import defaultdict
import re

import uuid
import concurrent.futures

warnings.filterwarnings("ignore", category=DeprecationWarning)

# ºöÂÔ FutureWarning
warnings.simplefilter(action='ignore', category=FutureWarning)


current_file_path = os.path.abspath(__file__)
current_dir_path = os.path.dirname(current_file_path)

# Set up configuration. Remember to input your OPENAI_API_KEY in config.ini file
config = configparser.ConfigParser()
config.read(os.path.join(current_dir_path, 'config.ini'))

os.environ['OPENAI_API_KEY'] = config['DEFAULT']['OPENAI_API_KEY']


# load prompts and few shot examples
with open(os.path.join(current_dir_path, './prompts.json')) as prompts_file:
    prompts = json.load(prompts_file)

with open(os.path.join(current_dir_path, './examples.json')) as examples_file:
    fewshot_examples = json.load(examples_file)

class PrivacyAttributes(BaseModel):
    first_name: str = Field(description='The first name of the persona')
    last_name:  str = Field(description='The last name of the persona')
    age: str = Field(description='The age of the persona')
    gender: str = Field(description='The gender of the persona')
    race: str = Field(description='The race of the persona')
    street: str = Field(description='The street of the persona living address')
    city: str = Field(description='The city of the persona living address')
    state: str = Field(description='The city of the persona living address')
    zip_code: str = Field(description='The zipcode of the persona living address')
    spoken_language: str = Field(description='The spoken language of the persona')
    education_background: str = Field(description='The education background of the persona')
    education_level: str = Field(description="The most suitable education level of the persona, four options: high school diploma, attending college, bachelor's degree, advanced degree")
    birthday: str = Field(description='The birthday of the persona')
    job: str = Field(description='The job of the persona')
    income: str = Field(description='The annual income of the persona')
    income_level: str = Field(description='The most suitable income level of the persona, three options: high income, moderate high income, average or lower income')
    marital_status: str = Field(description='The most suitable marital status of the persona, three options: single, married, in a relationship')
    parental_status: str = Field(description='The most suitable parental status of the persona, six options: not parents, parents of infants, parents of toddlers, parents of preschoolers, parents of grade schoolers, parents of teenagers')
    online_behavior: str = Field(description='The online behavior of the persona')
    industry: str = Field(description='The most suitable industry of the persona, eight options: construction, education, finance, healthcare, hospitality, manufacturing, real estate, technology')
    employer_size: str = Field(description='The most suitable employer size of the persona, three options: small employer (1-249 employees), large employer (250-10,000 employees), very large employer (more than 10,000 employees)')
    homeownership: str = Field(description='The most suitable homeownership status of the persona, either renter of homeowner')
    short_profile: str = Field(description='A short verstion of the profile')
    age_type: str = Field(description='Rate this persona age as young, mid-aged, or old')
    gender_type: str = Field(description='Rate this persona gender as male, female, or non-binary')
    location_type: str = Field(description='Rate this persona location as urban, suburb, or countryside')
    income_type: str = Field(description='Rate this persona income as low, medium, or high')
    edu_type: str = Field(description='Rate this persona educational level as low, medium, high')
    #profileImgUrl : str = Filed(description='The image of this persona')

class EventSet(BaseModel):
    event: list[str] = Field(description='A list of calendar event content')

class ScheduleEntry(BaseModel):
    start_time: str = Field(description='The start time of a schedule event in the format of YYYY-MM-DD hh:mm:ss')
    end_time: str = Field(description='The end time of a schedule event in the format of YYYY-MM-DD hh:mm:ss')
    event: str = Field(description='A schedule event in the calendar')
    address: str = Field(description='The place where the event happen, must including four parts: street, city, state, and zipcode')
    latitude: float = Field(description='The corresponding latitude of the address')
    longitude: float = Field(description='The corresponding longitude of the address')

class Schedule(BaseModel):
    schedule: list[ScheduleEntry]

class BrowsingHistoryEntry(BaseModel):
    time: str = Field(description="The time for browser history entry in the format of YYYY-MM-DD hh:mm:ss")
    title: str = Field(description="The website title of the browser history entry")
    url: str = Field(description="The url of the browsing history entry")

class BrowsingHistory(BaseModel):
    browsing_history: list[BrowsingHistoryEntry]

class Generator:
    def __init__(self):
        self.persona_profile = None
        self.persona_variant = None
        self.persona_attributes = None
        self._event_sets = None
        self.schedule = None
        self.browsing_history = []
        self.profileImgUrl = None

    def get_persona_profile(self, guidance) -> str:
        '''
        Generate the persona description from LLM

        Parameters:
            guidance(str): The text briefly describes a persona.

        Return	
            str: persona description
        '''
        examples = fewshot_examples['profile']

        example_prompt = PromptTemplate(
            input_variables=['persona'],
            template=prompts["profile"]["prompt"]
        )

        few_shot_prompt = FewShotPromptTemplate(
            examples=examples,
            example_prompt=example_prompt,
            prefix=prompts["profile"]["prefix"],
            suffix=prompts["profile"]["suffix"],
            input_variables=['guidance', "template"],
            example_separator="\n\n"
        )

        chain = LLMChain(llm=ChatOpenAI(model_name='gpt-4o',temperature=0.9),
                         prompt=few_shot_prompt)
        persona_profile = chain.invoke(input={'guidance':guidance, "template":prompts["profile"]["template"]})
        self.persona_profile = persona_profile["text"]

        return self.persona_profile

    def generate_image(self, guidance):
        client = OpenAI()  # will use environment variable "OPENAI_API_KEY"

        prompt = (
        "Subject: ballet dancers posing on a beam. "  # use the space at end
        "Style: romantic impressionist painting."     # this is implicit line continuation
        )

        image_params = {
        "model": "dall-e-3",  # Defaults to dall-e-2
        "n": 1,               # Between 2 and 10 is only for DALL-E 2
        "size": "256x256",  # 256x256, 512x512 only for DALL-E 2 - not much cheaper
        "prompt": prompt,     # DALL-E 3: max 4000 characters, DALL-E 2: max 1000
        "user": "myName",     # pass a customer ID to OpenAI for abuse monitoring
            }

        # ---- START
        # here's the actual request to API and lots of error catching
        try:
            images_response = client.images.generate(**image_params)
        except openai.APIConnectionError as e:
            print("Server connection error: {e.__cause__}")  # from httpx.
            raise
        except openai.RateLimitError as e:
            print(f"OpenAI RATE LIMIT error {e.status_code}: (e.response)")
            raise
        except openai.APIStatusError as e:
            print(f"OpenAI STATUS error {e.status_code}: (e.response)")
            raise
        except openai.BadRequestError as e:
            print(f"OpenAI BAD REQUEST error {e.status_code}: (e.response)")
            raise
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            raise
        
    

    def _process_attribute(self, v, attr_type, profile, whole_attr, gen_persona_variant, get_attributes):
        if v == attr_type:
            return {"value": v, "profile": profile, "attr": whole_attr}
        else:
            var_profile = gen_persona_variant(profile, v)
            return {"value": v, "profile": var_profile, "attr": get_attributes(var_profile)}

    

    def _gen_persona_variant(self, profile:str, version:str) -> str:
        '''
        Generate the persona variation based on a given profile and the version

        Parameters:
            profile(str): The base persona profile for variation.
            attr(str): The version str for getting variation.

        Return	
            str: variant persona profile
        '''
        examples = fewshot_examples['profile_variant']

        example_prompt = PromptTemplate(
            input_variables=['persona', 'version', 'variant'],
            template=prompts["profile_variant"]["prompt"]
        )

        few_shot_prompt = FewShotPromptTemplate(
            examples=examples,
            example_prompt=example_prompt,
            prefix=prompts["profile_variant"]["prefix"],
            suffix=prompts["profile_variant"]["suffix"],
            input_variables=["template", "persona", "version"],
            example_separator="\n\n"
        )

        chain = LLMChain(llm=ChatOpenAI(model_name='gpt-4o',temperature=0.9),
                         prompt=few_shot_prompt)
        persona_variant = chain.invoke(input={'persona':profile, 'version': version, "template":prompts["profile"]["template"]})
        
        return persona_variant["text"]
    
    
    def get_persona_variant(self, profile: str, attr: str, attr_type: str, whole_attr) -> str:
        '''
        Generate the persona variation based on a given profile and a privacy attributes

        Parameters:
            profile(str): The base persona profile for variation.
            attr(str): The privacy attributes for getting variation.

        Return	
            str: variant persona description
        '''

        attr_dict = {
            "Age": ["young", "mid-aged", "old"],
            "Gender": ["male", "female", "non-binary"],
            "Location (urbanization)": ["urban", "suburb", "countryside"],
            "Income": ["low", "medium", "high"],
            "Educational level": ["low", "medium", "high"]
        }

        # res = []
        # # versions = [value for value in attr_dict[attr] if value != attr_type]
        # for v in attr_dict[attr]:
        #     if v == attr_type:
        #         res.append({"value":v, "profile":profile, "attr":whole_attr})
        #     else:
        #         var_profile = self._gen_persona_variant(profile, v)
        #         res.append({"value":v, 
        #                     "profile":var_profile,
        #                     "attr":self.get_attributes(var_profile)})

        res = []
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [
                executor.submit(self._process_attribute, v, attr_type, profile, whole_attr, self._gen_persona_variant, self.get_attributes)
                for v in attr_dict[attr]
            ]
            for future in concurrent.futures.as_completed(futures):
                res.append(future.result())

        return res


        

    def get_attributes(self, profile: str) -> dict:
        '''
        Generate the persona's privacy attributes from the profile

        Input
            profile(str): the profile description of the persona to support generate its weekly event sets.

        Return
            attributes(dict): a dict of the parsed attributes
        '''
        curated_examples = []
        for i,v in enumerate(fewshot_examples["attributes"]):
            curated_examples.append({"persona": v["persona"], 
                                     "attributes_example": PrivacyAttributes.model_validate(v["attributes_example"]).model_dump_json().replace("{", "{{").replace("}", "}}")})
        examples = curated_examples

        example_prompt = PromptTemplate(
            input_variables=['persona', 'attributes_example'],
            template=prompts["attributes"]["prompt"]
        )

        attribute_parser = PydanticOutputParser(pydantic_object=PrivacyAttributes)

        few_shot_prompt = FewShotPromptTemplate(
            examples=examples,
            example_prompt=example_prompt,
            prefix="",
            suffix=prompts["attributes"]["suffix"],
            input_variables=['persona'],
            partial_variables={"format_instructions": attribute_parser.get_format_instructions()}
        )

        chain = LLMChain(llm=ChatOpenAI(model_name='gpt-4o',temperature=0.9),
                         prompt=few_shot_prompt)
        persona_attributes = chain.invoke(input={'persona':profile})
        self.persona_attributes = persona_attributes["text"]

        pattern = r'```json\n(.+?)\n```'
        match = re.search(pattern, self.persona_attributes, re.DOTALL)

        if match:
            res = eval(match.group(1))
        else:
            res = eval(persona_attributes["text"])

        return  res

    def _gen_events(self, profile: str) -> list:
        '''
        Generate the persona's event sets to support generate the schedule.

        Input
            profile(str): the profile description of the persona to support generate its weekly event sets.

        Return
            list: a event set for the input persona.
        '''
        event_parser = PydanticOutputParser(pydantic_object=EventSet)

        human_prompt = HumanMessagePromptTemplate.from_template("{request}\n{profile}\n{format_instructions}")
        chat_prompt = ChatPromptTemplate.from_messages([human_prompt])
        
        request = chat_prompt.format_prompt(
            profile = profile,
            request = prompts["event"]["prompt"],
            format_instructions = event_parser.get_format_instructions()
        ).to_messages()

        model = ChatOpenAI(model_name='gpt-4o',temperature=0.9)
        results = model(request)
        results_value = event_parser.parse(results.content)
        self._event_sets = results_value

        return self._event_sets
    
    def get_schedule(self, persona: str, start_date: str = "2024-05-01", end_date: str = "2024-05-01") -> list:
        '''
        Generate the persona's schedule.

        Input
            person(str): the profile description of the persona,
            start_date(str): the start date of the schedule in the format of YYYY-MM-DD
            end_date(str): the end date of the schedule in the format of YYYY-MM-DD

        Return
            list: the persona's schedule
        '''
       
        # We need to add .replace("{", "{{").replace("}", "}}") after serialising as JSON so that the curly brackets in the JSON won¡¯t be mistaken for prompt variables by LangChain
        curated_examples = []
        for i,v in enumerate(fewshot_examples['schedule']):
            curated_examples.append({"persona": v["persona"], 
                                     "event_example":v["event_example"], 
                                     "schedule_example":[]})
            for entry in v["schedule_example"]:
                curated_examples[i]["schedule_example"].append(ScheduleEntry.model_validate(entry).model_dump_json().replace("{", "{{").replace("}", "}}"))

        examples = curated_examples

        schedule_parser = PydanticOutputParser(pydantic_object=Schedule)
        
        example_prompt = PromptTemplate(
            input_variables=['persona', 'event_example', 'schedule_example'],
            template=prompts["schedule"]["prompt"],
        )

        few_shot_prompt = FewShotPromptTemplate(
            examples=examples,
            example_prompt=example_prompt,
            prefix=prompts["schedule"]["prefix"],
            suffix=prompts["schedule"]["suffix"],
            input_variables=['persona', "start_date", "end_date", "event_example"],
            partial_variables={"format_instructions": schedule_parser.get_format_instructions()},
        )

        chain = LLMChain(llm=ChatOpenAI(model_name='gpt-4o',temperature=0.5),
                         prompt=few_shot_prompt)
        generated_schedule = chain.invoke(input={
            'persona':persona, 
            'event_example': self._gen_events(persona),
            'start_date':start_date, 
            'end_date':end_date
        })

        self.schedule = generated_schedule['text']

        # self.schedule = eval(generated_schedule['text'])
        # self.schedule = self.schedule["schedule"]

        pattern = r'```json\n(.+?)\n```'
        match = re.search(pattern, generated_schedule['text'], re.DOTALL)


        if match:
            res = eval(match.group(1))
        else:
            res = eval(generated_schedule['text'])

        return res["schedule"]
    
    def get_device_browser(self, persona: str) -> dict:
        pass

    
    def _get_one_day_browsing_history(self, persona: str, date: str, schedule:list) -> list:
        '''
        Generate the persona's browsing history for one day.

        Input
            person(str): the profile description of the persona,
            start_date(str): the start date of the schedule in the format of YYYY-MM-DD
            end_date(str): the end date of the schedule in the format of YYYY-MM-DD
            schedule(list): the persona's one-day schedule to guide the browsing history generation

        Return
            browsing history(list): the persona's schedule
        '''
        curated_examples = []
        for i,v in enumerate(fewshot_examples['browsing_history']):
            curated_examples.append({"persona": v["persona"], 
                                     "schedule":[], 
                                     "browsing_history_example":[]})
            for s in v["schedule"]:
                curated_examples[i]["schedule"].append(ScheduleEntry.model_validate(s).model_dump_json().replace("{", "{{").replace("}", "}}"))
            
            for bh in v["browsing_history_example"]:
                curated_examples[i]["browsing_history_example"].append(BrowsingHistoryEntry.model_validate(bh).model_dump_json().replace("{", "{{").replace("}", "}}"))

        examples = curated_examples


        browsing_history_parser = PydanticOutputParser(pydantic_object=BrowsingHistory)
        
        example_prompt = PromptTemplate(
            input_variables=['persona', 'schedule', 'browsing_history_example'],
            template=prompts["browsing_history"]["prompt"],
        )

        few_shot_prompt = FewShotPromptTemplate(
            examples=examples,
            example_prompt=example_prompt,
            prefix=prompts["browsing_history"]["prefix"],
            suffix=prompts["browsing_history"]["suffix"],
            input_variables=['persona', "schedule", "date", "num"],
            partial_variables={"format_instructions": browsing_history_parser.get_format_instructions()},
        )

        chain = LLMChain(llm=ChatOpenAI(model_name='gpt-4o',temperature=0.5),
                         prompt=few_shot_prompt)
        generated_browsing_hitory = chain.invoke(input={
            'persona':persona, 
            'num': "10",
            'date':date,
            'schedule': schedule
        })

        pattern = r'```json\n(.+?)\n```'
        match = re.search(pattern, generated_browsing_hitory["text"], re.DOTALL)

        if match:
            res = eval(match.group(1))
        else:
            res = eval(generated_browsing_hitory["text"])

        return res['browsing_history']


    def get_browsing_history(self, persona: str, schedule:list, start_date: str = "2024-05-01", end_date: str = "2024-05-01") -> list:
        '''
        Generate the persona's browsing history.

        Input
            person(str): the profile description of the persona,
            schedule(list): the persona's schedule to guide the browsing history generation,
            start_date(str): the start date of the schedule in the format of YYYY-MM-DD,
            end_date(str): the end date of the schedule in the format of YYYY-MM-DD

        Return
            browsing history(list): the persona's schedule
        '''
        events_by_day = defaultdict(list)
        for event in schedule:
            start_date = datetime.strptime(event["start_time"], "%Y-%m-%d %H:%M:%S").date()
            events_by_day[str(start_date)].append(event)
        events_by_day = dict(events_by_day)

        for date in events_by_day:
            # one_day_history = json.loads(self._get_one_day_browsing_history(persona, date, events_by_day[date]))
            # one_day_history = one_day_history["browsing_history"]
            # self.browsing_history.extend(one_day_history)
            self.browsing_history.extend(self._get_one_day_browsing_history(persona, date, events_by_day[date]))

        return self.browsing_history