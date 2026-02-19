
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.*;
import java.util.*;

public class ContactService {

    private static final String FILE_NAME = "contacts.json";
    private List<Contact> contacts = new ArrayList<>();
    private int idCounter = 1;

    public void saveToFile() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.writerWithDefaultPrettyPrinter()
                    .writeValue(new File(FILE_NAME), contacts);
        } catch (Exception e) {
            System.out.println("Error saving JSON: " + e.getMessage());
        }
    }

    public void loadFromFile() {

        File file = new File(FILE_NAME);

        if (!file.exists() || file.length() == 0) {
            return; // First time run, no file yet or empty file
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            // Read the JSON array into a List of Contact objects
            contacts = mapper.readValue(file, mapper.getTypeFactory().constructCollectionType(List.class, Contact.class));

            // Reset idCounter properly
            if (!contacts.isEmpty()) {
                idCounter = contacts.stream()
                        .mapToInt(Contact::getId)
                        .max()
                        .orElse(0) + 1;
            } else {
                idCounter = 1; // If contacts list is empty, reset idCounter to 1
            }
        } catch (IOException e) {
            System.out.println("Error loading contacts: " + e.getMessage());
            contacts = new ArrayList<>(); // Initialize an empty list if loading fails
        }
    }

    public void addContact(String name, String phone, String email) {
        Contact contact = new Contact(idCounter++, name, phone, email);
        contacts.add(contact);
    }

    public List<Contact> getAllContacts() {
        return contacts;
    }

    public Contact deleteContact(int id) {
        for (Contact c : contacts) {
            if (c.getId() == id) {
                contacts.remove(c);
                return c;
            }
        }
        return null;
    }

    public List<Contact> search(String keyword) {
        List<Contact> results = new ArrayList<>();
        for (Contact c : contacts) {
            if (c.getName().toLowerCase().contains(keyword.toLowerCase())) {
                results.add(c);
            }
        }
        return results;
    }

    public List<String> getSuggestions(String prefix) {
        List<String> suggestions = new ArrayList<>();
        for (Contact c : contacts) {
            if (c.getName().toLowerCase().startsWith(prefix.toLowerCase())) {
                suggestions.add(c.getName());
            }
        }
        return suggestions;
    }

    private boolean isDuplicatePhone(String phone) {
        for (Contact c : contacts) {
            if (c.getPhone().equals(phone)) {
                return true;
            }
        }
        return false;
    }

    public void importFromCSV(String fileName) {

        try (BufferedReader br = new BufferedReader(new FileReader(fileName))) {

            String line;

            br.readLine(); // Skip header

            while ((line = br.readLine()) != null) {

                String[] data = line.split(",");

                if (data.length == 4) {

                    int id = Integer.parseInt(data[0]);
                    String name = data[1];
                    String phone = data[2];
                    String email = data[3];

                    Contact contact = new Contact(id, name, phone, email);
                    if (!isDuplicatePhone(phone)) {
                        contacts.add(contact);
                    } else {
                        System.out.println("Duplicate phone skipped: " + phone);
                    }

                    if (id >= idCounter) {
                        idCounter = id + 1;
                    }
                }
            }

            saveToFile(); // Save after import

            System.out.println("Import successful!");

        } catch (IOException e) {
            System.out.println("Error importing CSV: " + e.getMessage());
        }
    }

    public void exportToCSV(String fileName) {

        try (FileWriter writer = new FileWriter(fileName)) {

            // Header
            writer.write("ID,Name,Phone,Email\n");

            // Data
            for (Contact c : contacts) {
                writer.write(
                        c.getId() + ","
                        + c.getName() + ","
                        + c.getPhone() + ","
                        + c.getEmail() + "\n"
                );
            }

            System.out.println("Exported successfully to " + fileName);

        } catch (IOException e) {
            System.out.println("Error exporting file: " + e.getMessage());
        }
    }
}
