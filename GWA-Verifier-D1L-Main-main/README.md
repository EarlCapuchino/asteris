# **ASTERIS Web Application**
## **Software Description**
The Automated Student Entry and Record Inspection Software (ASTERIS) is an inhouse technology solution developed to aid in tackling the ever-increasing workload of the **UPLB CAS Scholarships, Honors, and Awards Committee** — concisely referred to as **SHAC**. ASTERIS serves as a digital **student general weighted average (GWA) verification interface** that provides extensive record inspection features accessible to SHAC members. The software enables collaborative student record processing over a network whilst ensuring that sensitive information security is given utmost priority.

-----
## **Contributors**
### **Project Manager**
Cardano, Cyrus Jude E. [@cyjcardano](https://github.com/cyjcardano)
### **Front-end Team**
- **Pascual, Jemimah Lorelai P. [@jlppascual](https://github.com/jlppascual)**
- Banglos, John Thomas S. [@BanglosT](https://github.com/BanglosT)
- Cervera, Leila Camille L. [@crvrlc](https://github.com/crvrlc)
- Olo, Christian Lois V. [@ChristianLois](https://github.com/ChristianLois)
### **Back-end Team**
- **Privado, Andrea Nicole G. [@andreanics](https://github.com/andreanics)**
- Arboleda, Martin Angelo B. [@mrtnrbld](https://github.com/mrtnrbld)
- Capuchino, Earl Samuel R. [@EarlCapuchino](https://github.com/EarlCapuchino)
- Mendoza, Arni Laureen Gabrielle C. [@arni-laureen](https://github.com/arni-laureen)
### **Database Team**
- **Teope, Neale Andrew C. [@GithAndrew](https://github.com/GithAndrew)**
- Bernardo, Yuane Kobe, V. [@kobeee24](https://github.com/kobeee24)
- Cardaño, Cyrus Jude E. [@cyjcardano](https://github.com/cyjcardano)
- Ong, Janica Mae C. [@changnika](https://github.com/changnika)
### **Version History**
- **ASTERIS: Andromeda** (alpha ver.) May 16, 2022 11:59PM
- **ASTERIS: Bode** (beta ver.) May 30, 2022 11:59PM
-----
## **Setting Up**
### **GENERAL**
1. Make sure that there are separate folders for front-end and back-end
2. Open two terminals, one for front-end and one for the back-end
3. Type `npm install` on both terminals so that node modules will be installed

### **FOR DATABASE:** 
4. Open the MariaDB command prompt, copy the path of where the `database.sql` is placed and go to it. 
5. type `mysql -u root -p`
6. type in your password -> type `source database.sql` -> type `use asteris`

### **FOR BACK-END:** 
#### **Environment**
7. Create a `.env` file on the root directory of the folder containing the following:

```
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_DATABASE=
DATABASE_PORT=

REACT_APP_HOST_IP=

SERVICE_TYPE=
ACCOUNT_EMAIL=
ACCOUNT_PASSWORD=
```

### **FOR FRONT-END:** 
#### **Environment**
8. Create a `.env` file on the root directory of the folder containing the following:

```
REACT_APP_HOST_IP=
```

### **TO OPEN PROGRAM:**
9. [BACK-END TERMINAL] type `node index.js`
10. [FRONT-END TERMINAL] type `npm start`

    *You're in ASTERIS!*

11. To see the console in the browser, press `Ctrl + Shift + i`
*You may also check the components in here*














