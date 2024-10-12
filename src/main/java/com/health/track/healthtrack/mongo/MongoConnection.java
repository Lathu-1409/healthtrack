package com.health.track.healthtrack.mongo;

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
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import java.util.concurrent.TimeUnit;

import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

@Component
public class MongoConnection {

    @Bean
    public MongoClient mongoClient() {

        String connectionString = "mongodb+srv://vignesh004vicky:IcTe22fyeBYcxe36@vickydevcluster.hvufz.mongodb.net/?retryWrites=true&w=majority&appName=VickyDevCluster";

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

        return MongoClients.create(settings);
    }

    // Example method to access the collection with the POJO codec
    public MongoCollection<User> getUserCollection() {
        MongoClient client = mongoClient();
        MongoDatabase database = client.getDatabase("MyTestDataBase")
                .withCodecRegistry(fromRegistries(
                        MongoClientSettings.getDefaultCodecRegistry(),
                        fromProviders(PojoCodecProvider.builder().automatic(true).build())
                ));

        return database.getCollection("MyTestCollection", User.class);  // Use the User class for the collection
    }
}