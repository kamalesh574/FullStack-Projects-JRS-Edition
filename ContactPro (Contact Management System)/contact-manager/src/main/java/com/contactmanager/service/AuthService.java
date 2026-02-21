package com.contactmanager.service;

import com.contactmanager.model.Role;

public class AuthService {

    public Role login(String username, String password) {

        if (username.equals("admin") && password.equals("admin123")) {
            return Role.ADMIN;
        }

        if (username.equals("viewer") && password.equals("viewer123")) {
            return Role.VIEWER;
        }

        return null;
    }
}