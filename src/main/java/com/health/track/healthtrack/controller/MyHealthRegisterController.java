package com.health.track.healthtrack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.health.track.healthtrack.model.request.User;
import com.health.track.healthtrack.model.request.UserLogin;
import com.health.track.healthtrack.service.HealthRegisterService;
@RestController
public class MyHealthRegisterController {

    @Autowired
    HealthRegisterService services;

 @PostMapping("/api/health/register")
    public ResponseEntity<Object> registerUser(@RequestBody User request) {
       
        System.out.println("Request received: "+request.toString());

        String response= services.insertUserDeatils(request);

        System.out.println("response : "+response);

        return ResponseEntity.ok(response);
    }
    

    @PostMapping("/api/health/login")
    public ResponseEntity<Object> loginUser(@RequestBody UserLogin request) {
       
        System.out.println("Request received: "+request.toString());

        String response= services.loginCheck(request);

        System.out.println("response : "+response);

        return ResponseEntity.ok(response);
    }
   

}
