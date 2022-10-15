package com.greenriverdev.narrowsmith.fallproject.controllers;

import com.greenriverdev.narrowsmith.fallproject.models.Query;
import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.services.TrailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/trail")
public class WebApiTrail
{

    private TrailService service;

    public WebApiTrail(TrailService service)
    {
        this.service = service;
    }

    @GetMapping("")
    public ResponseEntity<List<Trail>> allTrails()
    {
        return new ResponseEntity<>(service.allTrails(), HttpStatus.OK);
    }

    //getMapping with request
    @GetMapping("query")
    public ResponseEntity<Object> filterTrails(@RequestBody Query query)
    {
        //Don't allow this method to be used with an empty query
        if(query.getQueryValue() == null || query.getQueryValue().isEmpty())
        {
            return new ResponseEntity<>("the string cannot be null", HttpStatus.BAD_REQUEST);
        }

        //alternative using factory methods
        return ResponseEntity.ok(service.searchTrails(query.getQueryValue()));
    }

    //requestBody
    @PostMapping("")
    public ResponseEntity<Object> addATrail(@RequestBody Trail tempTrail)
    {
        //dont allow an empty trail name
        if(tempTrail.getName() == null || tempTrail.getName().isEmpty())
        {
            return new ResponseEntity<>("the trail name cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        if(tempTrail.getLength() <= 0 )
        {
            return new ResponseEntity<>("the trail length cannot be less than 0", HttpStatus.BAD_REQUEST);
        }

        if(tempTrail.getElevation() <= 0 )
        {
            return new ResponseEntity<>("the trail elevation cannot be less than 0", HttpStatus.BAD_REQUEST);
        }

        if(tempTrail.getState() == null || tempTrail.getState().isEmpty())
        {
            return new ResponseEntity<>("the trail state cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        if(tempTrail.getTrailSystem() == null || tempTrail.getTrailSystem().isEmpty())
        {
            return new ResponseEntity<>("the trail system cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        if(tempTrail.getDifficulty() == null )
        {
            return new ResponseEntity<>("the trail difficulty cannot be null", HttpStatus.BAD_REQUEST);
        }

        //if they are able to post return 201
        return new ResponseEntity<>(service.addTrail(tempTrail.getLength(), tempTrail.getElevation(),
                tempTrail.getState(), tempTrail.getTrailSystem(),
                tempTrail.getName(), tempTrail.isMultiDirectional(),
                tempTrail.getDifficulty()), HttpStatus.CREATED);
    }

    @PutMapping("")
    public ResponseEntity<Object> editATrail(@RequestBody Trail tempTrail)
    {
        //make sure the ID of the joke is found
        if(!service.trailExists(tempTrail.getTrailID()))
        {
            return new ResponseEntity<>("Trail does not exist", HttpStatus.NOT_FOUND);
        }
        //make sure not to add an empty joke
        else if(tempTrail.getName() == null || tempTrail.getName().isEmpty())
        {
            return new ResponseEntity<>("the trail name cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        else if(tempTrail.getLength() <= 0 )
        {
            return new ResponseEntity<>("the trail length cannot be less than 0", HttpStatus.BAD_REQUEST);
        }

        else if(tempTrail.getElevation() <= 0 )
        {
            return new ResponseEntity<>("the trail elevation cannot be less than 0", HttpStatus.BAD_REQUEST);
        }

        else if(tempTrail.getState() == null || tempTrail.getState().isEmpty())
        {
            return new ResponseEntity<>("the trail state cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        else if(tempTrail.getTrailSystem() == null || tempTrail.getTrailSystem().isEmpty())
        {
            return new ResponseEntity<>("the trail system cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        else if(tempTrail.getDifficulty() == null )
        {
            return new ResponseEntity<>("the trail difficulty cannot be null", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(service.updateTrail(tempTrail.getTrailID(), tempTrail.getLength(), tempTrail.getElevation(), tempTrail.getState(), tempTrail.getTrailSystem(),
                tempTrail.getName(), tempTrail.isMultiDirectional(), tempTrail.getDifficulty()), HttpStatus.OK);
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteATrail(@RequestBody Trail tempTrail)
    {
        //make sure the ID of the trail is found
        if(!service.trailExists(tempTrail.getTrailID()))
        {
            return new ResponseEntity<>("Trail does not exist", HttpStatus.NOT_FOUND);
        }

        service.deleteTrail(tempTrail.getTrailID());
        return new ResponseEntity<>(HttpStatus.OK);

    }
}
