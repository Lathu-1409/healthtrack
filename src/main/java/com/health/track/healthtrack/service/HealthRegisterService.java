package com.health.track.healthtrack.service;

import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.health.track.healthtrack.model.request.User;
import com.health.track.healthtrack.model.request.UserLogin;
import com.health.track.healthtrack.mongo.MongoConnection;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Filters;

@Component
public class HealthRegisterService {

    @Autowired(required = false)
    MongoConnection mongo;


    public String insertUserDeatils(User userDetails){

       try{
      MongoCollection<User> mongoConnect=mongo.getUserCollection();
       mongoConnect.insertOne(userDetails);
       return "Registration successful!! Thanks  for your Intrest "+userDetails.getFirstName()+" "+userDetails.getLastName();
       }catch (Exception e){
         if(e.getMessage().contains("dup key")){
            return "UserName already exist - "+userDetails.getUserName();
         }
        
       }
       return "failed try again later";
    }

    public String loginCheck(UserLogin userDetails){

      try{
      MongoCollection<User> mongoConnect=mongo.getUserCollection();
      Bson filterBson =Filters.eq("userName",userDetails.getUserName());

      User user= mongoConnect.find(filterBson).first();

      if(null==user || null==user.getUserName()){
         return "User doesn't exist try with valid userName....";
      }

      if(user.getPassword().equals(userDetails.getPassword())){
         return "Login Success !! Welcome "+ user.getFirstName();
      }else{
         return "Login Failed !! Try with Valid Password";
      }

   }catch(Exception e){
      return "Login Failed !! Try again later...";
   }     

    }
    
}
