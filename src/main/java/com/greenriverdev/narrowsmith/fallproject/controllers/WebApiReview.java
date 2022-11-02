package com.greenriverdev.narrowsmith.fallproject.controllers;

import com.greenriverdev.narrowsmith.fallproject.models.Query;
import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.models.TrailReview;
import com.greenriverdev.narrowsmith.fallproject.services.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * a RESTful Controller that provides access to TrailReview objects through HTTP
 * @author Nathan Arrowsmith
 * @version 1.0
 */
@RestController
@RequestMapping("api/v1/review")
public class WebApiReview
{
    private ReviewService service;

    /**
     * @param service ReviewService object responsible for model object CRUD logic
     */
    public WebApiReview(ReviewService service) { this.service = service; }

    /**
     * @return all model objects of type TrailReview
     */
    @GetMapping("")
    public ResponseEntity<List<TrailReview>> allReviews()
    {
        return new ResponseEntity<>(service.allReviews(), HttpStatus.OK);
    }

    /**
     * @param query a TrailReview trail name
     * @return all TrailReview objects with matching trail name
     */
    @GetMapping("queryTrail")
    public ResponseEntity<Object> filterReviewsByTrail(@RequestBody Query query)
    {
        //Don't allow this method to be used with an empty query
        if(query.getQueryValue() == null || query.getQueryValue().isEmpty())
        {
            return new ResponseEntity<>("the string cannot be null / key must be queryValue", HttpStatus.BAD_REQUEST);
        }

        //if trail name not found
        if(service.searchReviewsTrailName(query.getQueryValue()) == null
                || service.searchReviewsTrailName(query.getQueryValue()).isEmpty())
        {

            return new ResponseEntity<>("No Review found with matching trail name", HttpStatus.BAD_REQUEST);
        }
        //if trail name is found return it
        return ResponseEntity.ok(service.searchReviewsTrailName(query.getQueryValue()));

    }

    /**
     * @param query a TrailReview author name
     * @return all TrailReview objects with matching author name
     */
    @GetMapping("queryAuthor")
    public ResponseEntity<Object> filterReviewsByAuthor(@RequestBody Query query)
    {
        //Don't allow this method to be used with an empty query
        if (query.getQueryValue() == null || query.getQueryValue().isEmpty())
        {
            return new ResponseEntity<>("the string cannot be null / key must be queryValue", HttpStatus.BAD_REQUEST);
        }

        //if author name is not found
        if (service.searchReviewsAuthorName(query.getQueryValue()) == null ||
                service.searchReviewsAuthorName(query.getQueryValue()).isEmpty())
        {
            return new ResponseEntity<>("No Review found with matching author name", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(service.searchReviewsAuthorName(query.getQueryValue()));
    }

    /**
     * @param trailName name of Trail to search
     * @return all Trail objects matching that trail name
     */
    @GetMapping("{trailName}")
    public ResponseEntity<Object> getTrail(@PathVariable String trailName)
    {
        if ( service.searchReviewsByTrailName(trailName).isEmpty())
        {
            return new ResponseEntity<>("this trail cannot be found!", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(service.searchReviewsByTrailName(trailName));
    }

    /**
     * @param tempReview a new TrailReview object
     * @return the TrailReview object just created
     */
    @PostMapping("")
    public ResponseEntity<Object> addAReview(@RequestBody TrailReview tempReview)
    {
        if(tempReview.getAuthor() == null || tempReview.getAuthor().isEmpty())
        {
            return new ResponseEntity<>("the Author cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        if(tempReview.getDateReviewed() == null )
        {
            return new ResponseEntity<>("the review date cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

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
        return new ResponseEntity<>(service.addTrailReview(tempReview.getScore(), tempReview.getAuthor(),
                tempReview.getDateReviewed(), tempReview.isWouldRecommend(), tempReview.isRatingValid(),
                tempReview.getBikeRidden(), tempReview.getTrailConditions(), tempReview.getWeather(),
                tempReview.getTrailName()), HttpStatus.CREATED);
    }

    /**
     * @param tempReview a pre-existing TrailReview object with values altered
     * @return the TrailReview object just altered
     */
    @PutMapping("")
    public ResponseEntity<Object> editAReview(@RequestBody TrailReview tempReview)
    {
        //make sure the ID of the review is found
        if(!service.reviewExists(tempReview.getReviewID()))
        {
            return new ResponseEntity<>("Review does not exist", HttpStatus.NOT_FOUND);
        }

        else if(tempReview.getAuthor() == null || tempReview.getAuthor().isEmpty())
        {
            return new ResponseEntity<>("the Author cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

        else if(tempReview.getDateReviewed() == null )
        {
            return new ResponseEntity<>("the review date cannot be empty/null", HttpStatus.BAD_REQUEST);
        }

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

        return new ResponseEntity<>(service.updateTrailReview(tempReview.getReviewID(), tempReview.getScore(),
                tempReview.getAuthor(), tempReview.getDateReviewed(), tempReview.isWouldRecommend(),
                tempReview.isRatingValid(), tempReview.getBikeRidden(), tempReview.getTrailConditions(),
                tempReview.getWeather(), tempReview.getTrailName()), HttpStatus.OK);
    }

    /**
     * @param tempReview the reviewID of TrailReview object to be deleted
     * @return status OK if successfully deleted
     */
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

    @Override
    public String toString() {
        return "WebApiReview{" +
                "service=" + service +
                '}';
    }
}
