package com.contactmanager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.contactmanager.model.Contact;
import com.contactmanager.service.ContactService;

@RestController

@RequestMapping("/contacts")
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }
    
    @PostMapping
    public String addContact(@RequestBody Contact contact) {
        service.addContact(
                contact.getName(),
                contact.getPhone(),
                contact.getEmail()
        );
        return "Contact added successfully";
    }

    @GetMapping
    public List<Contact> getAll() {
        return service.getAllContacts();
    }

    @GetMapping("/search")
    public List<Contact> search(@RequestParam String keyword) {
        return service.smartSearch(keyword);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable int id) {
        service.deleteContact(id);
        return "Deleted successfully";
    }
}