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
Users can directly access this plugin from the Chrome extension. With a single click, they can generate a new synthetic persona and replace users' demographic data in Google accounts. This persona, complete with personal details like location and spoken language, is entirely AI-generated and adheres to strict privacy standards. No real user information is disclosed in the process, achieving an empathy-driven, risk-free sandbox. Users can then employ this synthetic persona to browse the web, analyze the impact on online recommendation systems such as Google ads and gain valuable insights into online privacy.
With this plugin, we combined self-report methods and integrates established theoretical frameworks of empathy to study users’ acquisition of privacy knowledge and finally improve their privacy literacy.

## Usage
- Download this depository locally
```
git clone https://github.com/Sudakks/Usable-Privacy-Sandbox.git
```
- Load it into Chrome extension
- Activate fastAPI and Flask
```
cd backend
python main.py
python app.py
```
