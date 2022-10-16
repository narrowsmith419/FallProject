package com.greenriverdev.narrowsmith.fallproject.services;

import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.models.TrailDifficulty;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * service layer to accompany WebApiTrail controller
 * locally stores Trail objects, provides CRUD access to these Trail objects
 * @author Nathan Arrowsmith
 * @version 1.0
 */
@Service
public class TrailService
{
    private List<Trail> trails = new ArrayList<>(List.of(
            new Trail(813, 483, "WA", "Duthie Hill", "Paramount",
                    false, TrailDifficulty.DOUBLE_BLACK),
            new Trail(758, 465, "WA", "Duthie Hill", "Semper Dirticus",
                    false, TrailDifficulty.DOUBLE_BLACK),
            new Trail(1007, 481, "WA", "Duthie Hill", "Voodoo Child",
                    false, TrailDifficulty.BLUE)
    ));

    /**
     * @param length length of trail
     * @param elevation elevation of the trail
     * @param state state where trail is located
     * @param trailSystem trail system where trail is located
     * @param name name of the trail
     * @param multiDirectional is it a one way or two-way trail?
     * @param difficulty { GREEN, BLUE, BLACK, DOUBLE_BLACK, PRO }
     * @return newly created Trail object
     */
    //CREATE
    public Trail addTrail(int length, int elevation, String state, String trailSystem,
                          String name, boolean multiDirectional, TrailDifficulty difficulty)
    {
        Trail added = new Trail(length, elevation, state, trailSystem,
            name, multiDirectional, difficulty);
        trails.add(added);
        return added;
    }


    /**
     * @return all Trail objects
     */
    //READ
    public List<Trail> allTrails()
    {
        return trails;
    }


    /**
     * @param id unique Identifier for Trail object
     * @param length length of trail
     * @param elevation elevation of the trail
     * @param state state where trail is located
     * @param trailSystem trail system where trail is located
     * @param name name of the trail
     * @param multiDirectional is it a one way or two-way trail?
     * @param difficulty { GREEN, BLUE, BLACK, DOUBLE_BLACK, PRO }
     * @return newly altered Trail object
     */
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


    /**
     * @param id of Trail object to be deleted
     */
    //DELETE
    public void deleteTrail(UUID id)
    {
        //for every trail without parameter TrailID add to list
        trails = trails.stream()
                .filter(trail-> !trail.getTrailID().equals(id)).toList();
    }


    /**
     * @param queryValue trail name of Trail to search
     * @return all Trail objects with matching trail name
     */
    //READ
    public List<Trail> searchTrails(String queryValue)
    {
        return trails.stream()
                .filter(trail -> trail.getName().toLowerCase()
                        .contains(queryValue.toLowerCase()))
                .toList();
    }


    /**
     * @param id Unique identifier of Trial object
     * @return whether Trail object exists with searching ID
     */
    public boolean trailExists(UUID id)
    {
        //add all trails with matching id to list, check if list is empty
        return trails.stream()
                .anyMatch(trail -> trail.getTrailID().equals(id));

    }


    @Override
    public String toString() {
        return "TrailService{" +
                "trails=" + trails +
                '}';
    }
}
