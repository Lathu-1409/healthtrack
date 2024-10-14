package com.health.track.healthtrack.mongo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.health.track.healthtrack.model.request.User;
import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerApi;
import com.mongodb.ServerApiVersion;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import jakarta.annotation.PostConstruct;

import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import java.util.concurrent.TimeUnit;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

@Component
public class MongoConnection {

@Autowired
MongoClient client;

    @Bean
    @PostConstruct
    public void mongoClient() {

        String connectionString = "";
        ServerApi serverApi = ServerApi.builder()
                .version(ServerApiVersion.V1)
                .build();

        // Create a CodecRegistry for POJOs
        CodecRegistry pojoCodecRegistry = fromRegistries(
                MongoClientSettings.getDefaultCodecRegistry(),
                fromProviders(PojoCodecProvider.builder().automatic(true).build())
        );

        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .serverApi(serverApi)
                .codecRegistry(pojoCodecRegistry)  // Add codecRegistry to MongoClientSettings
                .applyToSocketSettings(builder -> 
                    builder.connectTimeout(10, TimeUnit.SECONDS)
                           .readTimeout(10, TimeUnit.SECONDS))
                .applyToClusterSettings(builder -> 
                    builder.serverSelectionTimeout(5, TimeUnit.SECONDS))
                .applyToConnectionPoolSettings(builder -> 
                    builder.maxConnectionIdleTime(30, TimeUnit.MINUTES))
                .build();

                client= MongoClients.create(settings);
    }

    // Example method to access the collection with the POJO codec
    public MongoCollection<User> getUserCollection() {       
        MongoDatabase database = client.getDatabase("MyTestDataBase")
                .withCodecRegistry(fromRegistries(
                        MongoClientSettings.getDefaultCodecRegistry(),
                        fromProviders(PojoCodecProvider.builder().automatic(true).build())
                ));

        return database.getCollection("MyTestCollection", User.class);  // Use the User class for the collection
    }
}