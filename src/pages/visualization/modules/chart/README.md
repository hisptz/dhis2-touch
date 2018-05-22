# Chart Module for DHIS2

Angular 4 module with components and services for drawing different charts for dhis2 apps

# Dependencies

1. lodash `npm install --save lodash`

2. highcharts `npm install --save highcharts`

3. highcharts `npm install --save highcharts-grouped-categories`

# Installation

This module assumes that the angular app is created using [angular cli](https://cli.angular.io/).

To use this module add it as git submodule on your working directory (app directory for ng2/4 project) as follows:

`git submodule add git@github.com:hisptz/chart-module.git src/app/chart-module`

# Using Submodules

In order to fill in the submodule’s path with the files from the external repository, you must first initialize the submodules and then update them.

`git submodule init`

`git submodule update`

For more about git submodules click [here](https://chrisjean.com/git-submodules-adding-using-removing-and-updating/)

# Using menu module

In order to use chart module, import the module in your app.module.ts file as follows;

```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ChartModule //Module for dhis2 chart module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
``` 

# Components

This module have two externally available components

1. Chart list component (this accepts array of chart Layers)

2. Chart item component (this accepts analytics object and chart configuration)

# Using chart list component

This component can be used as follows

```
<app-chart-list
    [visualizationLayers]="visualizationLayers"
    [chartHeight]="itemHeight"
    [visualizationId]="visualizationId"
  ></app-chart-list>
    
```

where visualization is an array with settings and analytics object .i.e.

```
[ { 
    settings: object,
    analytics: object //with dhis analytics structure (<2.25)
    layout: object
  }
    ]
```

# Using chart item component

This component can be used as follows

```
<app-chart-item
         [chartConfiguration]="chartConfiguration"
         [analyticsObject]="analyticsObject"
         [chartHeight]="chartHeight"
       ></app-chart-item>

```


