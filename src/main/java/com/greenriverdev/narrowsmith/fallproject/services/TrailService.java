package com.greenriverdev.narrowsmith.fallproject.services;

import com.greenriverdev.narrowsmith.fallproject.models.Trail;
import com.greenriverdev.narrowsmith.fallproject.models.TrailDifficulty;
import com.greenriverdev.narrowsmith.fallproject.models.TrailSystem;
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
            Trail.builder()
                    .trailID(UUID.randomUUID())
                    .name("Voodoo Child")
                    .difficulty(TrailDifficulty.BLUE)
                    .elevation(481)
                    .length(1007)
                    .state("WA")
                    .trailSystem(new TrailSystem(47.58216, -121.97715, "Duthie Hill"))
                    .imageLink("../images/voodooTrail.jpeg")
                    .multiDirectional(false)
                    .build(),
            Trail.builder()
                    .trailID(UUID.randomUUID())
                    .name("Paramount")
                    .difficulty(TrailDifficulty.DOUBLE_BLACK)
                    .elevation(483)
                    .length(813)
                    .state("WA")
                    .trailSystem(new TrailSystem(47.58216, -121.97715, "Duthie Hill"))
                    .imageLink("../images/paramountTrail.jpeg")
                    .multiDirectional(false)
                    .build(),
            Trail.builder()
                    .trailID(UUID.randomUUID())
                    .name("Johnny Royale")
                    .difficulty(TrailDifficulty.DOUBLE_BLACK)
                    .elevation(1649)
                    .length(6336)
                    .state("OR")
                    .trailSystem(new TrailSystem(45.379585, -122.030078, "Sandy Ridge"))
                    .imageLink("../images/johnnyRoyaleTrail.jpeg")
                    .multiDirectional(false)
                    .build(),
            Trail.builder()
                    .trailID(UUID.randomUUID())
                    .name("Feedback")
                    .difficulty(TrailDifficulty.GREEN)
                    .elevation(387)
                    .length(804)
                    .state("WA")
                    .trailSystem(new TrailSystem(47.2231, -122.3945, "Swan Creek"))
                    .imageLink("../images/feedbackTrail.jpeg")
                    .multiDirectional(false)
                    .build(),
            Trail.builder()
                    .trailID(UUID.randomUUID())
                    .name("Ground Control")
                    .difficulty(TrailDifficulty.BLACK)
                    .elevation(488)
                    .length(1286)
                    .state("WA")
                    .trailSystem(new TrailSystem(47.2231, -122.3945, "Swan Creek"))
                    .imageLink("../images/groundControlTrail.jpeg")
                    .multiDirectional(false)
                    .build(),
            Trail.builder()
                    .trailID(UUID.randomUUID())
                    .name("Semper Dirticus")
                    .difficulty(TrailDifficulty.DOUBLE_BLACK)
                    .elevation(465)
                    .length(758)
                    .state("WA")
                    .trailSystem(new TrailSystem(47.58216, -121.97715, "Duthie Hill"))
                    .imageLink("../images/semperTrail.jpeg")
                    .multiDirectional(false)
                    .build()

    ));

    /**
     * @param length length of trail
     * @param elevation elevation of the trail
     * @param state state where trail is located
     * @param trailSystem trail system where trail is located
     * @param name name of the trail
     * @param imgLink location of image file for Trail
     * @param multiDirectional is it a one way or two-way trail?
     * @param difficulty { GREEN, BLUE, BLACK, DOUBLE_BLACK, PRO }
     * @return newly created Trail object
     */
    //CREATE
    public Trail addTrail(int length, int elevation, String state, TrailSystem trailSystem,
                          String name, String imgLink, boolean multiDirectional, TrailDifficulty difficulty)
    {
        Trail added = new Trail(length, elevation, state, trailSystem,
            name, imgLink, multiDirectional, difficulty);
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
     * @param imgLink location of image file for Trail
     * @param multiDirectional is it a one way or two-way trail?
     * @param difficulty { GREEN, BLUE, BLACK, DOUBLE_BLACK, PRO }
     * @return newly altered Trail object
     */
    //UPDATE
    public Trail updateTrail(UUID id, int length, int elevation, String state, TrailSystem trailSystem,
                             String name, String imgLink, boolean multiDirectional, TrailDifficulty difficulty)
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
            trail.setImageLink(imgLink);
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
     * This method returns a List of trail objects that match queried ID
     * @param id Unique Trail identifier for Trail object
     * @return trail with matching ID
     */
    //READ
    public List<Trail> searchTrailsByID(UUID id)
    {
        return trails.stream()
                .filter(trail -> trail.getTrailID()
                        .equals(id))
                .toList();
    }

    /**
     * This method returns a List of trail objects that match queried trail Name
     * @param trailName Name of Trail to find
     * @return a List of trails that match searched name
     */
    //READ
    public List<Trail> searchTrailsByTrailName(String trailName)
    {
        return trails.stream()
                .filter(trail -> trail.getName()
                        .equalsIgnoreCase(trailName))
                .toList();
    }

    /**
     * This method returns a List of all trails found at queried trail system name
     * @param trailSystemName name of TrailSystem to look up trails by
     * @return a List of all trails at searched TrailSystem name
     */
    //READ
    public List<Trail> searchTrailsByTrailSystem(String trailSystemName)
    {
        return trails.stream()
                .filter(trail -> trail.getTrailSystem().getName()
                        .equalsIgnoreCase(trailSystemName))
                .toList();
    }

    /**
     * This method returns a List of all trails found at queried trail difficulty
     * @param trailDifficulty TrailDifficulty Enum to look up trails by
     * @return a List of all trails with searched difficulty
     */
    //READ
    public List<Trail> searchTrailsByTrailDifficulty(String trailDifficulty)
    {
        return trails.stream()
                .filter(trail -> trail.getDifficulty().toString()
                        .equals(trailDifficulty))
                .toList();
    }


    /**
     * @param identifier Unique identifier of Trial object
     * @return whether Trail object exists with searching ID
     */
    public boolean trailExists(UUID identifier)
    {
        //add all trails with matching id to list, check if list is empty
        return trails.stream()
                .anyMatch(trail -> trail.getTrailID().equals(identifier));

    }


    @Override
    public String toString() {
        return "TrailService{" +
                "trails=" + trails +
                '}';
    }
}
