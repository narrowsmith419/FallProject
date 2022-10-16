package com.greenriverdev.narrowsmith.fallproject.controllers;

import com.greenriverdev.narrowsmith.fallproject.models.Query;
import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.models.TrailReview;
import com.greenriverdev.narrowsmith.fallproject.services.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/review")
public class WebApiReview
{
    private ReviewService service;

    public WebApiReview(ReviewService service) { this.service = service; }

    @GetMapping("")
    public ResponseEntity<List<TrailReview>> allReviews()
    {
        return new ResponseEntity<>(service.allReviews(), HttpStatus.OK);
    }

    @GetMapping("query")
    public ResponseEntity<Object> filterReviews(@RequestBody Query query)
    {
        //Don't allow this method to be used with an empty query
        if(query.getQueryValue() == null || query.getQueryValue().isEmpty())
        {
            return new ResponseEntity<>("the string cannot be null / key must be queryValue", HttpStatus.BAD_REQUEST);
        }

        //if not found
        if(service.searchReviews(query.getQueryValue()) == null || service.searchReviews(query.getQueryValue()).isEmpty())
        {
            return new ResponseEntity<>("No Review found with matching trail name", HttpStatus.BAD_REQUEST);
        }

        //alternative using factory methods
        return ResponseEntity.ok(service.searchReviews(query.getQueryValue()));
    }


    @PostMapping("")
    public ResponseEntity<Object> addAReview(@RequestBody TrailReview tempReview)
    {
        //dont allow an empty trail name
        if(tempReview.getTrailName() == null || tempReview.getTrailName().isEmpty())
        {
            return new ResponseEntity<>("the trail name cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        if(tempReview.getBikeRidden() == null || tempReview.getBikeRidden().isEmpty())
        {
            return new ResponseEntity<>("the bike type cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        if(tempReview.getTrailConditions() == null || tempReview.getTrailConditions().isEmpty())
        {
            return new ResponseEntity<>("the trail conditions cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        if(tempReview.getWeather() == null || tempReview.getWeather().isEmpty())
        {
            return new ResponseEntity<>("the weather cannot be null", HttpStatus.BAD_REQUEST);
        }


        //if they are able to post return 201
        return new ResponseEntity<>(service.addTrailReview(tempReview.isRatingValid(), tempReview.getBikeRidden(),
                tempReview.getTrailConditions(), tempReview.getWeather(),
                tempReview.getTrailName()), HttpStatus.CREATED);
    }

    @PutMapping("")
    public ResponseEntity<Object> editAReview(@RequestBody TrailReview tempReview)
    {
        //make sure the ID of the joke is found
        if(!service.reviewExists(tempReview.getReviewID()))
        {
            return new ResponseEntity<>("Review does not exist", HttpStatus.NOT_FOUND);
        }
        //make sure not to add an empty joke
        else if(tempReview.getTrailName() == null || tempReview.getTrailName().isEmpty())
        {
            return new ResponseEntity<>("the trail name cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        else if(tempReview.getBikeRidden() == null || tempReview.getBikeRidden().isEmpty())
        {
            return new ResponseEntity<>("the bike type cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        else if(tempReview.getTrailConditions() == null || tempReview.getTrailConditions().isEmpty())
        {
            return new ResponseEntity<>("the trail conditions cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        else if(tempReview.getWeather() == null || tempReview.getWeather().isEmpty())
        {
            return new ResponseEntity<>("the weather cannot be null", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(service.updateTrailReview(tempReview.getReviewID(), tempReview.isRatingValid(), tempReview.getBikeRidden(),
            tempReview.getTrailConditions(), tempReview.getWeather(),
            tempReview.getTrailName()), HttpStatus.OK);
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteAReview(@RequestBody TrailReview tempReview)
    {
        //make sure the ID of the trail is found
        if(!service.reviewExists(tempReview.getReviewID()))
        {
            return new ResponseEntity<>("Review does not exist", HttpStatus.NOT_FOUND);
        }

        service.deleteReview(tempReview.getReviewID());
        return new ResponseEntity<>(HttpStatus.OK);

    }



}
