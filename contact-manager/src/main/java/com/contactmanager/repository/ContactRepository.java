package com.contactmanager.repository;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.contactmanager.model.Contact;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ContactRepository {

    private static final String FILE_NAME = "contacts.json";

    public void save(List<Contact> contacts) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.writerWithDefaultPrettyPrinter()
                    .writeValue(new File(FILE_NAME), contacts);
        } catch (Exception e) {
            System.out.println("Error saving JSON: " + e.getMessage());
        }
    }

    public List<Contact> load() {
        try {
            File file = new File(FILE_NAME);
            if (!file.exists()) {
                return new ArrayList<>();
            }

            ObjectMapper mapper = new ObjectMapper();

            return new ArrayList<>(
                    Arrays.asList(
                            mapper.readValue(file, Contact[].class)
                    )
            );

        } catch (Exception e) {
            System.out.println("Error loading JSON: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}