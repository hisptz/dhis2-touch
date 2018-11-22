/*
 *
 * Copyright 2015 HISP Tanzania
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * @since 2015
 * @author Joseph Chingalo <profschingalo@gmail.com>
 *
 */
import { Injectable } from '@angular/core';

/*
  Generated class for the HelpContentsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HelpContentsProvider {
  constructor() {}

  /**
   * getHelpContents
   * @returns {{}}
   */
  getHelpContents() {
    let helpContent = [
      {
        id: '1.0',
        name: 'Overview',
        tags: 'overview.help',
        contents:
          'The android based mobile application aims to ship full dhis2 web experience completely offline on the Android Smartphone for data entry and event capture with capabilities for automatic synchronization via internet or SMS with login instance based on synchronization settings. It combines different DHIS 2 web Apps and Features including Data Entry, Event Capture, Reports, Sync, Dashboard and Settings. DHIS 2 Touch also has Utility Apps such as Profile, About, Help and Logout.',
        subMenu: [
          {
            id: '1.1',
            name: 'Features of DHIS2',
            contents:
              'DHIS2 Touch allows sharing of data among Stakeholders for their monitoring, analysis, planning and decision making. Its features can be summarized using the classical definition of the system which comprises of input, process and output.',
            subMenu: [
              {
                id: '1.1.1',
                name: 'Input',
                contents:
                  'DHIS2 Touch provides user-friendly interface for users to enter data. The screens for data entry do imitate the paper forms. Essentially, this feature enables entering into the system HMIS data which is collected from Village/Mtaa. '
              },
              {
                id: '1.1.2',
                name: 'Process',
                contents:
                  'DHIS2 Touch automatically computes sums, indicators and checks the validity of the data to make sure the data entered reflects the reality on the ground. '
              },
              {
                id: '1.1.3',
                name: 'Output',
                contents:
                  'Provides different tools for reporting – both for automated routine reports and analysis reports, and in addition provides the user with functionality and flexibility to make their user defined reports. This includes:-Reports which provides access to the Periodic Report Form and  Dashboard which provides quick access to the favorites HMIS indicators.'
              }
            ]
          },
          {
            id: '1.2',
            name: 'How to use the DHIS2 TOUCH',
            contents:
              'This section provides instructions and guidance on how to use DHIS 2 Touch app and how to navigate to its features',
            subMenu: []
          },
          {
            id: '1.3',
            name: 'Installation and Login',
            contents:
              'The DHIS 2 Touch App may be downloaded from HISPTZ App store and installed on the Android Smartphone. Once successfully installed the App, the login screen of the system will appear, asking to fill in authentication details such as URL for DHIS 2 instance, Username and Password to be able to log into the App . In case the login is not successful you will be notified immediately that either URL for DHIS2 instance, Username or Password provided is incorrect and will be asked to re-enter the credentials. Once the credentials are correct, click login button for App to download all necessary metadata. Download of DHIS2 Touch on the user’s smartphones enables them to download all necessary metadata required for using the App offline.',
            subMenu: []
          },
          {
            id: '1.4',
            name: 'Menus and Navigation',
            contents:
              'DHIS2 Touch App has two menu systems: Apps menu and Utilities menu. The Apps menu leads to various modules which include Data entry, Reports, and Event capture which works offline and Dashboard, module which needs internet connectivity to sync with server to get data presented. The Utility apps also leads to various modules which include Profile, About, Help, and Logout.',
            subMenu: [
              {
                id: '1.4.1',
                name: 'Navigating the App menu',
                contents:
                  'The DHIS2 Touch App consists of various modules (major components) which each have specific features. Such features include Data Entry, Reports, Event Capture, Dashboard, Sync, and Settings. Navigating from one module to another under App menu is by touching on the component of your selection. Once any of the module has been selected, it will open to allow user to further continue with selecting other important parameters for data entry or to display data in the App. To go back to select other module components of Apps, user needs to press back button of their smartphones.'
              },
              {
                id: '1.4.2',
                name: 'Navigating the utility menu',
                contents:
                  'DHIS 2 Touch App consists of various utility modules which have specific features. Such features include Profile, About, Help, and Logout. Navigating from one module to another under Utility menu is by touching on the component of your selection. Touching a back button of smartphone will bring a user utility menus to select another module.'
              }
            ]
          }
        ]
      },
      {
        id: '2.0',
        name: 'Data Entry',
        tags: 'Data entry aggregate',
        contents:
          'This App is for offline aggregate data reporting at all levels. To enter data in the mobile App, click data entry in the App menu. then select organization unit, data set and period from data entry menu to get data entry form opened',
        subMenu: [
          {
            id: '2.1',
            name: 'Selecting Data Entry Form',
            contents:
              'To enter data in the DHIS2 Touch, first open the data entry by touching the data entry icon in the App menu: Then select the facility where data are to be enterd by navigating through organization unit until the targeted facility is reached. Select data set from the list of available data sets according to services provided in the facility. Then click the next button to select the period for data entry. Click ENTER DATA button to get the data entry form opened. View opened data entry form and enter data.'
          }
        ]
      },
      {
        id: '3.0',
        name: 'Event Capture',
        tags: 'data event capture',
        contents:
          'To enter data as events, touch Event Capture App menu. Then select facility, program for which data are to be entered and click the plus button at the right bottom corner, Touch the input box below the label Report date to select year, month and date the event was reported. Once the selected program has opened, enter data by inserting or selecting values as instructed. then touch SAVE button to store the entered values in the app.'
      },
      {
        id: '4.0',
        name: 'Dashboard',
        tags:
          'table charts visualization visualizer data dashboard dashboarditems',
        contents:
          'DHIS2 Touch allows data visualization through dashboard module. The phone needs to be connected to the internet for dashboards items to be accessed from server and loaded to the mobile phone. The dashboard present data in different formats such as tables and charts. Once data are visualized in charts, user can switch to various types of charts available aside the chart. Also user can switch between charts and tables. Once dashboard app is selected it will load all lists of available dashboard then visualization in first dashboard. dashboard provides a mechanism to organize and share the saved favorite of more interest for quick  visualization. To open the dashboard, follow these steps Click on the Apps button. A menu will appear then click on the dashboard option. Then press the highlighted right menu to get list of data sets or indicators to be visualized in the dashboard, then select one data element or indicator for visualization of its values or charts from the list of displayed options as circled in area 1, figure 11. Once you have selected the data element or indicator, the table or chart will be displayed in the dashboard. Once chart has been displayed in the dashboard, user can switch to table and vice versa by touching on the icons below charts or tables. When data are visualized in charts, user can touch charts icons to switch to different type of charts.'
      },
      {
        id: '5.0',
        name: 'Setting',
        tags: 'data entry form Synchronization',
        contents:
          'Settings allow user to set up various options regarding mobile data app in the android device and the server. the following options can be changed via settings',
        subMenu: [
          {
            id: '5.1',
            name: 'Synchronization',
            contents:
              'This is the option that user can set up to define the frequency (in minutes or hours) data can be sent from the device to the server. After getting to the setting, user can touch the label Synchronization to get option to change the synchronization time, both the numbers and its units. Then user can press SAVE button save new the changes'
          },
          {
            id: '5.2',
            name: 'Entry Form',
            contents:
              'DHIS 2 touch app gives option for user to make changes on Form label and maximum number of data elements to be displayed under one section of the form. Click data entry form option to be able to select options under it. Select Form label to select DHIS2 display name or DHIS2 Form name options. User can set maximum data element per section that can make the entire form to be displayed in one page or sections of it to be displayed in separate pages Press SAVE button to save the changes . Selecting of DHIS2 Display Name will result to the display of data elements names that are named in similar way as display form names are named . Selection of DHIS2 Form Name will make user to get data elements named in similar way as data elements are named'
          }
        ]
      },
      {
        id: '6.0',
        name: 'Sync',
        tags: 'sync metadata data internet local clear upload sms',
        contents:
          'Sync allow user to send data from the mobile phone to the ministry server, update metadata and clear data stored in the mobile phonme that is used to collect data. under sync app, Upload data via SMS, Download Metadata and Clear Offline Data are performed as follows',
        subMenu: [
          {
            id: '6.1',
            name: 'Upload Data Via SMS',
            contents:
              'Upload Data gives room for HMIS Mobile App users to send data from the smartphone to the main ministry server through sending SMS. When user enters data offline, they will be stored in the smartphone until they are send to the main server at the ministry. The HMIS Mobile app can be used to send data even if there is no internet by SMS. The following are the steps, Once Sync App has been pressed to get inside it, press Upload Data via SMS button to get options to select (area 1, figure 16), then press on data set option to get the list of data sets for which its data are to be uploaded (area 2, figure 16), then touch the button to select the period type (area 3, figure 16). Enter the special number that will be given to users for sending data through SMS (area 4, figure 16), then press OPLOAD DATA button to send data to the given number (area 5, figure 16)'
          },
          {
            id: '6.2',
            name: 'Upload Data Via internet',
            contents: 'Content coming soon.'
          },
          {
            id: '6.3',
            name: 'Download Metadata',
            contents:
              'DHIS2 touch allows user to download and update data definitions and reports whenever changes has been made in the system. Examples of data definitions (metadata) are organization units, Data sets, Indicators etc. For Example if a new facility has been added or there is change of status of the facility, user needs to update these changes in his device. The following are the steps to download and update metadata. Touch the Sync app in the menu , then touch Download Metadata button to get the list to be updated . Select the metadata to be updated from the list, then touch Update button on the top or bottom of the list to update'
          },
          {
            id: '6.4',
            name: 'Download data',
            contents: 'Content coming soon.'
          },
          {
            id: '6.5',
            name: 'Clear local data',
            contents:
              'Clear Offline Data is an option that gives user to clear HMIS data values or events that are stored in the smartphone. This feature helps in empting storage space of the android phones once data have been synced to the main server. user needs to select Clear Offline Data among the listed options under Sync App. Tick Data values check box when aggregate data values are to be cleared, In case both Data values and Events are to be deleted from the smartphone, user needs to check both check boxes in the list. Press CLEAR DATA option to delete selected data in the smartphone '
          },
          {
            id: '6.6',
            name: 'Clear local metadata',
            contents: 'Content coming soon.'
          }
        ]
      },
      {
        id: '7.0',
        name: 'Managing utilities menu',
        tags: 'managing utilities menu about profile logout log out',
        contents:
          'Utility menu has modules that allow user to view user profile, system information, configuration of some parameters and logout. This is the part where user can change some default system settings that came with an app after downloading.',
        subMenu: [
          {
            id: '7.1',
            name: 'About',
            contents:
              'About menu allow user view various system and data information setup and exchange between mobile phone and server. Once user has pressed About button, he will be able to view various system information such as name of the App, Version number, aggregate data values and events synced to the server.',
            subMenu: []
          },
          {
            id: '7.2',
            name: 'Profile',
            contents:
              'Its for users to view their profile information as they are entered or updated in the DHIS2 system. Through profile user can see the assigned organization unit, roles, assigned programs, and assigned forms.',
            subMenu: []
          },
          {
            id: '7.3',
            name: 'Logout',
            contents:
              'DHIS 2 is secured system. It needs username and password for user to login. However as for any other applications run on android, once it has been downloaded and installed in user’s mobile phones, it remains open and therefore anyone who may have access to open such mobile phone can access the HMIS Mobile App as well. To avoid that, users are asked to logout every time they finish accessing it. User needs to go to utility menu and touch Logout icon. Once user touched a logout icon, the system will immediately logout and login page for user to enter password to login.',
            subMenu: []
          }
        ]
      }
    ];
    return this.getHelpContentAsObject(helpContent);
  }

  /**
   * getHelpContentAsObject
   * @param helpContents
   * @returns {{}}
   */
  getHelpContentAsObject(helpContents) {
    let object = {};
    helpContents.forEach(helpContent => {
      object[helpContent.id] = helpContent;
    });
    return object;
  }
}
