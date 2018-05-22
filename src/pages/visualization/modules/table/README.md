# Table Module for DHIS2

Angular 4 module with components and services for drawing tables for dhis2 apps

# Installation

This module assumes that the angular app is created using [angular cli](https://cli.angular.io/).

To use this module add it as git submodule on your working directory (app directory for ng2/4 project) as follows:

`git submodule add git@github.com:hisptz/table-module.git src/app/table`

# Using Submodules

In order to fill in the submodule’s path with the files from the external repository, you must first initialize the submodules and then update them.

`git submodule init`

`git submodule update`

For more about git submodules click [here](https://chrisjean.com/git-submodules-adding-using-removing-and-updating/)

# Using table module

In order to use chart module, import the module in your app.module.ts file as follows;

```
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TableModule //Module for dhis2 table module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
``` 

# Components

This module have two externally available components

1. Table list component (this accepts array of chart Layers)

2. Table item component (this accepts analytics object and chart configuration)

# Using table list component

This component can be used as follows

```
<app-table-list
    [visualizationLayers]="visualizationLayers"
  >
  </app-table-list>
    
```

where visualizationLayers is an array with settings and analytics object .i.e.

```
[ { 
    settings: object,
    analytics: object //with dhis analytics structure (<2.25)
    layout: object
  }
    ]
```

# Using table item component

This component can be used as follows

```
<app-table-item
      [analyticsObject]="tableLayer.analyticsObject"
      [tableConfiguration]="tableLayer.tableConfiguration"
    >
    </app-table-item>

```

