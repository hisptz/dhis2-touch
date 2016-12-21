# DHIS 2 Touch
<p>District Health Information Software 2 Mobile Application that features full blown support for aggregate routine and survey data collection.
Application has been built to support:</p>
<ol>
<li>Completely offline data storage and synchronization with main server without dropping offline stored data</li>
<li>Completely offline report generation for HTML standard reports (no server analytics needed)</li>
<li>Support extension for custom logics(e.g. skip logic, values relationship checks,automated saving, etc..)</li>
<li>Support for default and section forms with pagination </li>
<li>Support for all Android devices</li>
</ol>
<a  target="_blank" href="https://play.google.com/store/apps/details?id=com.hipstz.dhis2.dhis2touch">Click to download</a>

##Prerequisites
  Make sure you have the following installed
  
  1. npm
  2. ionic
  3. cordova
  4. Emulator (android studio etc.) or android phone for testing
  
## Installation

  1.  `npm install`
  
  2. Run this script to install cordova plugins to access phone resources
    
     `sh installPlugins.sh`
     
  3. Start the emulator or open an app from the phone when connected in debug mode by running
  
    `ionic run android`
    
## troubleshoots
    Incase you encounter error "bundle failed: 'ChartModule' is not exported by node_modules/angular2-highcharts/index.js" on build app, 
     
      Edit "node_modules/@ionic/app-scripts/config/rollup.config.js"<br>
      
      replace commonjs(),  with <br>
      commonjs({
            namedExports: { 'node_modules/angular2-highcharts/index.js':['ChartModule']}
          }),
      

