<h1 align="center">Microsoft Teams Clone</h1>

<div align="center">Teams clone created for program Microsoft Engage'21</div>

[User guide and documentation](https://docs.google.com/document/d/10dPu8eNqgqIco803z9e7D7Gf9fN4D9HgAuBp5E7uplg/edit?usp=sharing)
<hr />

> ## Tech Stack 
- ReactJS with typescript for frontend and Fluent UI as a component library 
- NodeJS express in typescript at backend.
- The core video calling functionality is handled by WebRtc with a wrapper library simple-peer  
- signalling using socket.io

> ## Features
1. Group Video Calling functionality using mesh network.
2. User Authentication 
3. Create / Delete Teams and add members to it.
4. Team Group Chat 
5. Video Call Functions : 
  - Media Stream Controls : Turn on/off video and audio
  - Invite a user : input email and click on bell to send a notification to the user with a join meeting button
  - Share meeting link button to copy the meeting link
  - Meeting ChatBox : Chatting feature for ongoing meeting [persistent]

> ## Local Setup
- client
```sh
   cd client
   npm install 
   npm start
```
or 
install the dependencies and use the shell script from the root
```sh
   sh run_frontend.sh
```
- server
```sh
   cd server
   npm install 
   npm run dev
```
or 
install the dependencies and use the shell script from the root
```sh
   sh run_server.sh
```
> ## Documentation
Complete info about project and user guide can be found in this [doc](https://github.com/akshatgarg12/Microsoft-engage-project/blob/main/docs/doc.pdf) and demo in this video 
