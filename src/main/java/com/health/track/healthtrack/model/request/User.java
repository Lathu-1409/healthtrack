package com.health.track.healthtrack.model.request;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String userName;
    private String email;
    private String password; // Encrypted password
    private Date registrationDate; // Date when the user registered
    private Date lastLogin; // Timestamp of the last login
    private String firstName; // User's first name
    private String lastName; // User's last name
    public Object map(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'map'");
    }
}