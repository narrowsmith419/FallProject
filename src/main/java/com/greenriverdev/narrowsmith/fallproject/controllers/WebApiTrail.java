package com.greenriverdev.narrowsmith.fallproject.controllers;

import com.greenriverdev.narrowsmith.fallproject.models.Query;
import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.services.TrailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.xml.crypto.dom.DOMCryptoContext;
import java.util.List;
import java.util.UUID;

/**
 * a RESTful Controller that provides access to Trail objects through HTTP
 * @author Nathan Arrowsmith
 * @version 1.0
 */
@RestController
@RequestMapping("api/v1/trail")
public class WebApiTrail
{

    private TrailService service;

    /**
     * @param service ReviewService object responsible for model object CRUD logic
     */
    public WebApiTrail(TrailService service)
    {
        this.service = service;
    }

    /**
     * @return all model objects of type Trail
     */
    @GetMapping("")
    public ResponseEntity<List<Trail>> allTrails()
    {
        return new ResponseEntity<>(service.allTrails(), HttpStatus.OK);
    }

    /**
     * @param query a Trail name
     * @return all Trail objects with matching trail name
     */
    @GetMapping("query")
    public ResponseEntity<Object> filterTrails(@RequestBody Query query)
    {
        //Don't allow this method to be used with an empty query
        if(query.getQueryValue() == null || query.getQueryValue().isEmpty())
        {
            return new ResponseEntity<>("the string cannot be null", HttpStatus.BAD_REQUEST);
        }

        //if not found
        if(service.searchTrails(query.getQueryValue()) == null || service.searchTrails(query.getQueryValue()).isEmpty())
        {
            return new ResponseEntity<>("No trail found with matching name", HttpStatus.BAD_REQUEST);
        }

        //alternative using factory methods
        return ResponseEntity.ok(service.searchTrails(query.getQueryValue()));
    }

    //TODO: ADD ERROR REPORTING

    @GetMapping("{id}")
    public ResponseEntity<Object> getTrail(@PathVariable UUID id)
    {
        return ResponseEntity.ok(service.searchTrailsByID(id));
    }

    /**
     * @param tempTrail a new Trailobject
     * @return the Trail object just created
     */
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
                tempTrail.getName(), tempTrail.getImageLink(), tempTrail.isMultiDirectional(),
                tempTrail.getDifficulty()), HttpStatus.CREATED);
    }

    /**
     * @param tempTrail a pre-existing Trail object with values altered
     * @return the Trail object just altered
     */
    @PutMapping("")
    public ResponseEntity<Object> editATrail(@RequestBody Trail tempTrail)
    {

        if(!service.trailExists(tempTrail.getTrailID()))
        {
            return new ResponseEntity<>("Trail does not exist", HttpStatus.NOT_FOUND);
        }

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

        return new ResponseEntity<>(service.updateTrail(tempTrail.getTrailID(), tempTrail.getLength(),
                tempTrail.getElevation(), tempTrail.getState(), tempTrail.getTrailSystem(),
                tempTrail.getName(), tempTrail.getImageLink(), tempTrail.isMultiDirectional(),
                tempTrail.getDifficulty()), HttpStatus.OK);
    }

    /**
     * @param tempTrail the reviewID of Trail object to be deleted
     * @return status OK if successfully deleted
     */
    @DeleteMapping("")
    public ResponseEntity<Object> deleteATrail(@RequestBody Trail tempTrail)
    {
        if(!service.trailExists(tempTrail.getTrailID()))
        {
            return new ResponseEntity<>("Trail does not exist", HttpStatus.NOT_FOUND);
        }

        service.deleteTrail(tempTrail.getTrailID());
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @Override
    public String toString() {
        return "WebApiTrail{" +
                "service=" + service +
                '}';
    }
}
