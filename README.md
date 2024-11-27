# Usabel Privacy Sandbox
## Overview
Privacy has long been a concern for users when browsing the internet. To prevent personal information of users from leakage, we proposed a privacy sandbox so that users can browse the Internet with a new persona, either a selected one from our predefined personas or a new one. We also hope that users can gain knowledge concerning privacy after using our sandbox. 

## Demo
https://github.com/user-attachments/assets/6542c92b-16b2-4362-941d-73014b2f1bae

## Interface
logo
![image](https://github.com/user-attachments/assets/c34e8c4e-ecb6-409f-938c-e18b3ed75694)

designed in Figma, implemented using JavaScript, CSS, HTML
![image](https://github.com/user-attachments/assets/9dd4d031-26b6-4aae-a5dd-ce762637de90)

## Function of the Plugin
Users can access this plugin directly from the Chrome extension. They can generate new Persona and subsitute the original Chrome account with this Persona. It has complete personal information, such as location, spoken language and so on. They all generated by LLMs and belongs to synthetic data without disclosure of any user information. User can utilize this Persona to surf on the websites and gain privacy knowledge.

## Usage
- Download this depository locally
```
git clone asdjks
```
- Load it into Chrome extension
- Activate fastAPI
```
cd backend
python main.py
python app.py
```
