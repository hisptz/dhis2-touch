import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/Rx';
import {Observable, Observer} from 'rxjs';
import {HttpClientProvider} from "./http-client/http-client";

@Injectable()
export class OrgUnitService {

  nodes: any[] = null;
  orgunit_levels:any[] = [];
  user_orgunits:any[] = [];
  orgunit_groups:any[] = [];
  initial_orgunits:any[] = [];
  constructor(private http: HttpClientProvider) { }

  // Get current user information
  getUserInformation (currentUser,priority=null) {
    if(priority == false){
      return this.http.get('/api/me.json?fields=dataViewOrganisationUnits[id,name,level],organisationUnits[id,name,level]',currentUser)
        .catch( this.handleError );
    }else{
      return this.http.get('/api/me.json?fields=organisationUnits[id,name,level]',currentUser)
        .catch( this.handleError );
    }
  }


  getuserOrganisationUnitsWithHighestlevel(level,userOrgunits){
    let orgunits = [];
      if(!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')){
        userOrgunits.organisationUnits.forEach((orgunit) => {
          if ( orgunit.level == level ){
            orgunits.push(orgunit.id);
          }
        })
      }
      else{
        if(userOrgunits.dataViewOrganisationUnits.length == 0){
          userOrgunits.organisationUnits.forEach((orgunit) => {
            if ( orgunit.level == level ){
              orgunits.push(orgunit.id);
            }
          })
        }else{
          level = userOrgunits.dataViewOrganisationUnits[0].level;
          userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
            if ( orgunit.level == level ){
              orgunits.push(orgunit.id);
            }
          })
        }
      }
    return orgunits;
  }

  /**
   * get the highest level among organisation units that user belongs to
   * @param userOrgunits
   * @returns {any}
   */
  getUserHighestOrgUnitlevel(userOrgunits){
    let level: any;
    let orgunits = [];
    if(!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')){
      level = userOrgunits.organisationUnits[0].level;
      userOrgunits.organisationUnits.forEach((orgunit) => {
        if ( orgunit.level <= level ){
          level = orgunit.level;
        }
      })
    }else{
      if(userOrgunits.dataViewOrganisationUnits.length == 0){
        level = userOrgunits.organisationUnits[0].level;
        userOrgunits.organisationUnits.forEach((orgunit) => {
          if ( orgunit.level <= level ){
            level = orgunit.level;
          }
        })
      }else{
        level = userOrgunits.dataViewOrganisationUnits[0].level;
        userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
          if ( orgunit.level <= level ){
            level = orgunit.level;
          }
        })
      }
    }
    return level;
  }

  /**
   * get the list of user orgunits as an array
   * @param userOrgunits
   * @returns {any}
   */
  getUserOrgUnits(userOrgunits){
    let orgunits = [];
    if(!userOrgunits.hasOwnProperty('dataViewOrganisationUnits')){
      userOrgunits.organisationUnits.forEach((orgunit) => {
        orgunits.push(orgunit);
      })
    }else{
      if(userOrgunits.dataViewOrganisationUnits.length == 0){
        userOrgunits.organisationUnits.forEach((orgunit) => {
          orgunits.push(orgunit);
        })
      }else{
        userOrgunits.dataViewOrganisationUnits.forEach((orgunit) => {
          orgunits.push(orgunit);
        })
      }
    }
    return orgunits;
  }

  prepareOrgunits(currentUser,priority=null){
    this.getOrgunitLevelsInformation(currentUser)
      .subscribe(
        (data: any) => {
          this.orgunit_levels = data.organisationUnitLevels;
          this.getUserInformation(priority).then(
            (userOrgunit : any) => {
              userOrgunit = JSON.parse(userOrgunit.data);
              this.user_orgunits = this.getUserOrgUnits( userOrgunit );
              let level = this.getUserHighestOrgUnitlevel(userOrgunit);
              let all_levels = data.pager.total;
              let orgunits = this.getuserOrganisationUnitsWithHighestlevel(level,userOrgunit);
              let use_level = parseInt(all_levels) - (parseInt(level) - 1);
              let fields = this.generateUrlBasedOnLevels(use_level);
              this.getAllOrgunitsForTree1(fields, orgunits).subscribe(
                items => {
                  //noinspection TypeScriptUnresolvedVariable
                  this.nodes = items.organisationUnits;
                }
              )
            }
          )
        }
      );
    this.getOrgunitGroups(currentUser).then( groups => {
      this.orgunit_groups = groups.organisationUnitGroups
    });
  }


  // Generate Organisation unit url based on the level needed
  generateUrlBasedOnLevels (level){
    let childrenLevels = "[]";
    for (let i = 1; i < level+1; i++) {
      childrenLevels = childrenLevels.replace("[]", "[id,name,level,children[]]")
    }
    let new_string = childrenLevels.substring(1);
    new_string = new_string.replace(",children[]]","");
    return new_string;
  }

  // Get system wide settings
  getOrgunitLevelsInformation (currentUser) {
    return Observable.create(observer => {
      if(this.orgunit_levels.length != 0){
        observer.next(this.orgunit_levels);
        observer.complete();
      }else{
        this.http.get('/api/organisationUnitLevels.json?fields=id,name,level&order=level:asc',currentUser)
          .catch( this.handleError )
          .then((levels : any) => {
            levels = JSON.parse(levels.data);
            this.orgunit_levels = levels;
            observer.next(this.orgunit_levels);
            observer.complete();
          },
          error=>{
            observer.error("some error occur")
          })
      }
    })
  }

  // Get organisation unit groups information
  getOrgunitGroups (currentUser) {
    return Observable.create(observer => {
      if(this.orgunit_groups.length != 0){
        observer.next(this.orgunit_groups);
        observer.complete();
      }else{
        this.http.get('/api/organisationUnitGroups.json?fields=id,name&paging=false',currentUser)
          .catch( this.handleError )
          .then((groups: any) => {
              groups = JSON.parse(groups.data);
              this.orgunit_groups = groups.organisationUnitGroups;
              observer.next(this.orgunit_groups);
              observer.complete();
            },
            error=>{
              observer.error("some error occur")
            })
      }
    })
  }

  // Get system wide settings
  getAllOrgunitsForTree (fields,currentUser) {
    return this.http.get('/api/organisationUnits.json?filter=level:eq:1&paging=false&fields=' + fields,currentUser)
      .catch( this.handleError );
  }

  // Get orgunit for specific
  getAllOrgunitsForTree1 (currentUser,fields = null, orgunits = null) {
    return Observable.create(observer => {
      if(this.nodes != null) {
        observer.next(this.nodes);
        observer.complete();
      } else {
        this.http.get('/api/organisationUnits.json?fields=' + fields +'&filter=id:in:['+orgunits.join(",")+']&paging=false',currentUser)
          .catch( this.handleError )
          .then((nodes: any) => {
            nodes = JSON.parse(nodes.data);
            this.nodes = nodes.organisationUnits;
            observer.next(this.nodes);
            observer.complete();
          },error => {
            observer.error("some error occured")
          })
      }
    })

  }

  // Get initial organisation units to speed up things during loading
  getInitialOrgunitsForTree (orgunits,currentUser) {
    return Observable.create(observer => {
      if(this.initial_orgunits != null) {
        observer.next(this.initial_orgunits);
        observer.complete();
      } else {
        this.http.get('/api/organisationUnits.json?fields=id,name,level,children[id,name]&filter=id:in:['+orgunits.join(",")+']&paging=false',currentUser)
          .catch( this.handleError )
          .then((nodes: any) => {
            nodes = JSON.parse(nodes.data);
            this.initial_orgunits = nodes.organisationUnits;
            observer.next(this.initial_orgunits);
            observer.complete();
          },error => {
            observer.error("some error occured")
          })
      }
    });
  }

  // Handling error
  handleError (error: any) {
    return Observable.throw( error );
  }


}


