package com.greenriverdev.narrowsmith.fallproject.services;

import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.models.TrailDifficulty;
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

    //CREATE
    public Trail addTrail(int length, int elevation, String state, String trailSystem,
                          String name, boolean multiDirectional, TrailDifficulty difficulty)
    {
        Trail added = new Trail(length, elevation, state, trailSystem,
            name, multiDirectional, difficulty);
        trails.add(added);
        return added;
    }


    //READ
    public List<Trail> allTrails()
    {
        return trails;
    }


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
            trail.setTrailID(id);
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


    //DELETE
    public void deleteTrail(UUID id)
    {
        //for every trail without parameter TrailID add to list
        trails = trails.stream()
                .filter(trail-> !trail.getTrailID().equals(id)).toList();
    }


    //READ
    public List<Trail> searchTrails(String queryValue)
    {
        return trails.stream()
                .filter(trail -> trail.getName().toLowerCase()
                        .contains(queryValue.toLowerCase()))
                .toList();
    }


    public boolean trailExists(UUID id)
    {
        //add all trails with matching id to list, check if list is empty
        return trails.stream()
                .anyMatch(trail -> trail.getTrailID().equals(id));

    }


}
