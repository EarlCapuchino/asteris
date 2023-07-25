import React from 'react';
import * as IoIcons from 'react-icons/io5';
import { BsClockHistory } from 'react-icons/bs';
import { HiDocument } from 'react-icons/hi';

export const SidebarDataUser =  [
    {
        title: 'Create User',
        path: '/users/new',
        icon: <IoIcons.IoPersonAdd />,
        cName: 'menu-side-item'
    },
    {
        title: 'Users',
        path: '/users',
        icon: <IoIcons.IoPerson />,
        cName: 'menu-side-item'
    },
    {
        title: 'Logs',
        path: '/logs',
        icon: <BsClockHistory />,
        cName: 'menu-side-item'
    },
];

export const SidebarDataStudent =  [
    {
        title: 'Create Student',
        path: '/student/new',
        icon: <IoIcons.IoPersonAdd />,
        cName: 'menu-side-item'
    },
    {
        title: 'Students',
        path: '/students',
        icon: <IoIcons.IoPerson />,
        cName: 'menu-side-item'
    },
    {
        title: 'Student Summary',
        path: '/summary',
        icon: <HiDocument />,
        cName: 'menu-side-item'
    },
];