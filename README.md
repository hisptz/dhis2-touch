# hisptz Touch
<p>District Health Information Software 2 Mobile Application that features full blown support for aggregate routine and survey data collection.
Application has been built to support:</p>
<ol>
<li>Completely offline data storage and synchronization with main server without dropping offline stored data</li>
<li>Visualization support such as change between different charts or table and charts</li>
<li>Completely offline report generation for HTML standard reports (no server analytics needed)</li>
<li>Support extension for custom logics(e.g. skip logic, values relationship checks,automated saving, etc..)</li>
<li>Support for default and section forms with pagination </li>
<li>Support for all Android devices</li>
</ol>
<a  target="_blank" href="https://play.google.com/store/apps/details?id=com.hipstz.dhis2.dhis2touch">Click to download</a>

##Dhis version support
  Currently It has been tested and work perfectyly for dhis 2 version upto 2.26
  
##Prerequisites
  Make sure you have the following installed
  
  1. npm
  2. Ionic CLI 3.2.0 or above
  3. Cordova CLI 6.5.0 or above
  4.Emulator (android studio etc.) or android phone for testing
  5. Clone the project

  
## Installation 

  1.  `npm install`
       
  2. Start the emulator or open an app from the phone when connected in debug mode by running
  
    `ionic run android`
    
## troubleshoots
  In case you encounter error "bundle failed: 'ChartModule' is not exported by node_modules/angular2-highcharts/index.js" on build app, 
     
  Edit "node_modules/@ionic/app-scripts/config/rollup.config.js"  
      
      replace commonjs(),  
      
  with 
  
      commonjs({
            namedExports: { 'node_modules/angular2-highcharts/index.js':['ChartModule']}
          }),
      

