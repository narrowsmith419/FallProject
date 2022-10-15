package com.greenriverdev.narrowsmith.fallproject.services;

import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.models.TrailDifficulty;
import com.greenriverdev.narrowsmith.fallproject.models.TrailReview;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TrailService
{
    private List<Trail> trails = new ArrayList<>(List.of(
            new Trail(813, 483, "WA", "Duthie Hill", "Paramount", false, TrailDifficulty.DOUBLE_BLACK),
            new Trail(758, 465, "WA", "Duthie Hill", "Semper Dirticus", false, TrailDifficulty.DOUBLE_BLACK),
            new Trail(1007, 481, "WA", "Duthie Hill", "Voodoo Child", false, TrailDifficulty.BLUE)
    ));

    private List<TrailReview> reviews = new ArrayList<>(List.of(
            new TrailReview(true, "Trek Remedy", "Dry", "Evening/Sunny", "Paramount"),
            new TrailReview(true, "Trek Remedy", "Dry", "Evening/Sunny", "Semper Dirticus")
    ));

    //CREATE
    public Trail addTrail(int length, int elevation, String state, String trailSystem,
                          String name, boolean multiDirectional, TrailDifficulty difficulty)
    {
        Trail added = new Trail(length, elevation, state, trailSystem,
            name, multiDirectional, difficulty);
        trails.add(added);
        return added;
    }

    public TrailReview addTrailReview(boolean isRatingValid, String bikeRidden, String trailConditions, String weather,
                                      String name )
    {
        TrailReview added = new TrailReview(isRatingValid, bikeRidden, trailConditions, weather,
            name);
        reviews.add(added);
        return added;
    }

    //READ
    public List<Trail> allTrails()
    {
        return trails;
    }
    public List<TrailReview> allReviews() { return reviews; }

    //UPDATE
    public Trail updateTrail(UUID id, int length, int elevation, String state, String trailSystem,
                             String name, boolean multiDirectional, TrailDifficulty difficulty)
    {
        //optional is a wrapper to either store a null value or store a joke
        Optional<Trail> foundTrail = trails.stream()
                .filter(trail-> trail.getTrailID().equals(id))
                .findFirst();

        if(foundTrail.isPresent()) //if it's not null
        {
            //update it
            Trail trail = foundTrail.get();
            trail.setDifficulty(difficulty);
            trail.setLength(length);
            trail.setElevation(elevation);
            trail.setState(state);
            trail.setTrailSystem(trailSystem);
            trail.setName(name);
            trail.setMultiDirectional(multiDirectional);
            return trail;
        }
        else
        {
            //otherwise return null
            return null;
        }
    }

    public TrailReview updateTrailReview(UUID id, boolean isRatingValid, String bikeRidden, String trailConditions, String weather,
                                         String name)
    {
        //optional is a wrapper to either store a null value or store a joke
        Optional<TrailReview> foundTrailReview = reviews.stream()
                .filter(review -> review.getReviewID().equals(id))
                .findFirst();

        if(foundTrailReview.isPresent()) //if it's not null
        {
            //update it
            TrailReview review = foundTrailReview.get();
            review.setRatingValid(isRatingValid);
            review.setBikeRidden(bikeRidden);
            review.setTrailConditions(trailConditions);
            review.setWeather(weather);
            review.setTrailName(name);
            return review;
        }
        else
        {
            return null;
        }
    }

    //DELETE
    public void deleteTrail(UUID id)
    {
        //for every trail without parameter TrailID add to list
        trails = trails.stream()
                .filter(trail-> !trail.getTrailID().equals(id)).toList();
    }

    public void deleteReview(UUID id)
    {
        reviews = reviews.stream()
                .filter(review -> !review.getReviewID().equals(id)).toList();
    }

    //READ
    public List<Trail> searchTrails(String queryValue)
    {
        return trails.stream()
                .filter(trail -> trail.getName().toLowerCase()
                        .contains(queryValue.toLowerCase()))
                .toList();
    }

    public List<TrailReview> searchReviews(String queryValue)
    {
        return reviews.stream()
                .filter(review -> review.getTrailName().toLowerCase()
                        .contains(queryValue.toLowerCase()))
                .toList();
    }

    public boolean trailExists(UUID id)
    {
        //add all trails with matching id to list, check if list is empty
        return trails.stream()
                .anyMatch(trail -> trail.getTrailID().equals(id));

    }

    public boolean reviewExists(UUID id)
    {
        return reviews.stream()
                .anyMatch(review -> review.getReviewID().equals(id));

    }
}
