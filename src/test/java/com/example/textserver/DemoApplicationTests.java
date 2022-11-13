package com.example.textserver;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;

import org.json.simple.JSONObject;

import java.util.ArrayList;

/**
 * Unit test for simple App.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class DemoApplicationTests {
	@LocalServerPort
	private int port;

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
    	public void shouldAnswerWithTrue1()
    	{
		HttpHeaders headers = new HttpHeaders();
    		headers.setContentType(MediaType.APPLICATION_JSON);
    		JSONObject prod1JSON = new JSONObject();
    		prod1JSON.put("message", "Hello1!");
    		JSONObject prod2JSON = new JSONObject();
    		prod2JSON.put("message", "Hello2!");
    		JSONObject prod3JSON = new JSONObject();
    		prod3JSON.put("message", "Hello3!");
    		JSONObject prod4JSON = new JSONObject();
    		prod4JSON.put("message", "Hello4!");
    		JSONObject prod5JSON = new JSONObject();
    		prod5JSON.put("message", "Hello5!");
    		JSONObject prod6JSON = new JSONObject();
    		prod6JSON.put("message", "Hello6!");

		HttpEntity<String> request = 
     	 		new HttpEntity<String>(prod1JSON.toString(), headers);

		this.restTemplate.postForObject("http://localhost:" + port + "/messages",
				request, Message.class);
		
		request = new HttpEntity<String>(prod2JSON.toString(), headers);
		
		this.restTemplate.postForObject("http://localhost:" + port + "/messages",
				request, Message.class);

		Message[] prods = this.restTemplate.getForObject( "http://localhost:" + port + "/messages",
				Message[].class);

		for( Message p : prods ){
			System.out.println( "From returned list" );
			System.out.println( p );
		}

    	}
}

