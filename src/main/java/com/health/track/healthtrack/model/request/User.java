package com.health.track.healthtrack.model.request;

import lombok.Data;

@Data
public class User {

    private String userName;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String mobileNum;

}
