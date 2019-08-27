'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">DHIS 2 Touch</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AboutPageModule.html" data-type="entity-link">AboutPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AboutPageModule-815ce94e35f968c5b656a90dd46797d8"' : 'data-target="#xs-components-links-module-AboutPageModule-815ce94e35f968c5b656a90dd46797d8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AboutPageModule-815ce94e35f968c5b656a90dd46797d8"' :
                                            'id="xs-components-links-module-AboutPageModule-815ce94e35f968c5b656a90dd46797d8"' }>
                                            <li class="link">
                                                <a href="components/AboutPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AboutPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AccountsPageModule.html" data-type="entity-link">AccountsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AccountsPageModule-1bcde1e81d180f68c5c2129b2e4e7d1d"' : 'data-target="#xs-components-links-module-AccountsPageModule-1bcde1e81d180f68c5c2129b2e4e7d1d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccountsPageModule-1bcde1e81d180f68c5c2129b2e4e7d1d"' :
                                            'id="xs-components-links-module-AccountsPageModule-1bcde1e81d180f68c5c2129b2e4e7d1d"' }>
                                            <li class="link">
                                                <a href="components/AccountsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccountsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-7cc0e577e834e54aa8163a00c1930d9a"' : 'data-target="#xs-components-links-module-AppModule-7cc0e577e834e54aa8163a00c1930d9a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-7cc0e577e834e54aa8163a00c1930d9a"' :
                                            'id="xs-components-links-module-AppModule-7cc0e577e834e54aa8163a00c1930d9a"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-7cc0e577e834e54aa8163a00c1930d9a"' : 'data-target="#xs-injectables-links-module-AppModule-7cc0e577e834e54aa8163a00c1930d9a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-7cc0e577e834e54aa8163a00c1930d9a"' :
                                        'id="xs-injectables-links-module-AppModule-7cc0e577e834e54aa8163a00c1930d9a"' }>
                                        <li class="link">
                                            <a href="injectables/AppColorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppColorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AppConfigService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppConfigService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AppTransalationsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppTransalationsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BarcodeReaderService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BarcodeReaderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CategoryComboService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CategoryComboService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DataElementService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DataElementService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DataSetService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DataSetService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DataStoreManagerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DataStoreManagerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EncryptionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>EncryptionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GeolocationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GeolocationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HttpClientService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>HttpClientService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/IndicatorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>IndicatorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalInstanceService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalInstanceService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStorageService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStorageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NetworkService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NetworkService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrganisationUnitService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>OrganisationUnitService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProgramRuleEngineService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProgramRuleEngineService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProgramService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProgramService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProgramStageSectionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProgramStageSectionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SectionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SectionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SettingService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SettingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SmsCommandService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SmsCommandService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StandardResportService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StandardResportService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SystemInformationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SystemInformationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SystemSettingService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SystemSettingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ToasterMessagesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ToasterMessagesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserAuthorizationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserAuthorizationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ValidationRuleService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ValidationRuleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppsComponentsModule.html" data-type="entity-link">AppsComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppsComponentsModule-66cc314f1a7a11c562624f93a9497f7b"' : 'data-target="#xs-components-links-module-AppsComponentsModule-66cc314f1a7a11c562624f93a9497f7b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppsComponentsModule-66cc314f1a7a11c562624f93a9497f7b"' :
                                            'id="xs-components-links-module-AppsComponentsModule-66cc314f1a7a11c562624f93a9497f7b"' }>
                                            <li class="link">
                                                <a href="components/AppItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppsItemContainerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppsItemContainerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppsPageModule.html" data-type="entity-link">AppsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppsPageModule-f87f51274d2231e5c3360dc3474694c6"' : 'data-target="#xs-components-links-module-AppsPageModule-f87f51274d2231e5c3360dc3474694c6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppsPageModule-f87f51274d2231e5c3360dc3474694c6"' :
                                            'id="xs-components-links-module-AppsPageModule-f87f51274d2231e5c3360dc3474694c6"' }>
                                            <li class="link">
                                                <a href="components/AppsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoordinateComponentsModule.html" data-type="entity-link">CoordinateComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CoordinateComponentsModule-b4e422f04a1eb1a0653acd43d4b68431"' : 'data-target="#xs-components-links-module-CoordinateComponentsModule-b4e422f04a1eb1a0653acd43d4b68431"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoordinateComponentsModule-b4e422f04a1eb1a0653acd43d4b68431"' :
                                            'id="xs-components-links-module-CoordinateComponentsModule-b4e422f04a1eb1a0653acd43d4b68431"' }>
                                            <li class="link">
                                                <a href="components/CoordinateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoordinateComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoordinateSelectionPageModule.html" data-type="entity-link">CoordinateSelectionPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CoordinateSelectionPageModule-8e38c4db7e5ebccdebeb3819c3469acb"' : 'data-target="#xs-components-links-module-CoordinateSelectionPageModule-8e38c4db7e5ebccdebeb3819c3469acb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoordinateSelectionPageModule-8e38c4db7e5ebccdebeb3819c3469acb"' :
                                            'id="xs-components-links-module-CoordinateSelectionPageModule-8e38c4db7e5ebccdebeb3819c3469acb"' }>
                                            <li class="link">
                                                <a href="components/CoordinateSelectionPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoordinateSelectionPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardPageModule.html" data-type="entity-link">DashboardPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardPageModule-eb6a00754c076d19d31692147c311298"' : 'data-target="#xs-components-links-module-DashboardPageModule-eb6a00754c076d19d31692147c311298"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardPageModule-eb6a00754c076d19d31692147c311298"' :
                                            'id="xs-components-links-module-DashboardPageModule-eb6a00754c076d19d31692147c311298"' }>
                                            <li class="link">
                                                <a href="components/DashboardPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DataEntryPageModule.html" data-type="entity-link">DataEntryPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DataEntryPageModule-88f33e1da1a24c9aab8b3b2a9aa9b707"' : 'data-target="#xs-components-links-module-DataEntryPageModule-88f33e1da1a24c9aab8b3b2a9aa9b707"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DataEntryPageModule-88f33e1da1a24c9aab8b3b2a9aa9b707"' :
                                            'id="xs-components-links-module-DataEntryPageModule-88f33e1da1a24c9aab8b3b2a9aa9b707"' }>
                                            <li class="link">
                                                <a href="components/DataEntryPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DataEntryPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventCapturePageModule.html" data-type="entity-link">EventCapturePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EventCapturePageModule-e90e4ce679e0af2e98e7d4d9d16b804d"' : 'data-target="#xs-components-links-module-EventCapturePageModule-e90e4ce679e0af2e98e7d4d9d16b804d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EventCapturePageModule-e90e4ce679e0af2e98e7d4d9d16b804d"' :
                                            'id="xs-components-links-module-EventCapturePageModule-e90e4ce679e0af2e98e7d4d9d16b804d"' }>
                                            <li class="link">
                                                <a href="components/EventCapturePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventCapturePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HelpPageModule.html" data-type="entity-link">HelpPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HelpPageModule-59e609ca068b3401a715859f3ee00110"' : 'data-target="#xs-components-links-module-HelpPageModule-59e609ca068b3401a715859f3ee00110"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HelpPageModule-59e609ca068b3401a715859f3ee00110"' :
                                            'id="xs-components-links-module-HelpPageModule-59e609ca068b3401a715859f3ee00110"' }>
                                            <li class="link">
                                                <a href="components/HelpPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HelpPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LaunchComponentsModule.html" data-type="entity-link">LaunchComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LaunchComponentsModule-be91cfd832601d47c9db6fa5e9924b40"' : 'data-target="#xs-components-links-module-LaunchComponentsModule-be91cfd832601d47c9db6fa5e9924b40"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LaunchComponentsModule-be91cfd832601d47c9db6fa5e9924b40"' :
                                            'id="xs-components-links-module-LaunchComponentsModule-be91cfd832601d47c9db6fa5e9924b40"' }>
                                            <li class="link">
                                                <a href="components/SloganComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SloganComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LaunchPageModule.html" data-type="entity-link">LaunchPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LaunchPageModule-46b6ebba0751b20f6512d471053f127c"' : 'data-target="#xs-components-links-module-LaunchPageModule-46b6ebba0751b20f6512d471053f127c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LaunchPageModule-46b6ebba0751b20f6512d471053f127c"' :
                                            'id="xs-components-links-module-LaunchPageModule-46b6ebba0751b20f6512d471053f127c"' }>
                                            <li class="link">
                                                <a href="components/LaunchPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LaunchPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LocalInstanceSelectionPageModule.html" data-type="entity-link">LocalInstanceSelectionPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LocalInstanceSelectionPageModule-ec6a08cf96e1517409ddd407dbab4306"' : 'data-target="#xs-components-links-module-LocalInstanceSelectionPageModule-ec6a08cf96e1517409ddd407dbab4306"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LocalInstanceSelectionPageModule-ec6a08cf96e1517409ddd407dbab4306"' :
                                            'id="xs-components-links-module-LocalInstanceSelectionPageModule-ec6a08cf96e1517409ddd407dbab4306"' }>
                                            <li class="link">
                                                <a href="components/LocalInstanceSelectionPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LocalInstanceSelectionPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginComponentsModule.html" data-type="entity-link">LoginComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginComponentsModule-b57292f594925b43e27ada832d559438"' : 'data-target="#xs-components-links-module-LoginComponentsModule-b57292f594925b43e27ada832d559438"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginComponentsModule-b57292f594925b43e27ada832d559438"' :
                                            'id="xs-components-links-module-LoginComponentsModule-b57292f594925b43e27ada832d559438"' }>
                                            <li class="link">
                                                <a href="components/LoginFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginMetadataSyncComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginMetadataSyncComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginSpinnerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginSpinnerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link">LoginPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginPageModule-2b3de2dab0d4e9f7d0973e1c6d2c1e3b"' : 'data-target="#xs-components-links-module-LoginPageModule-2b3de2dab0d4e9f7d0973e1c6d2c1e3b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginPageModule-2b3de2dab0d4e9f7d0973e1c6d2c1e3b"' :
                                            'id="xs-components-links-module-LoginPageModule-2b3de2dab0d4e9f7d0973e1c6d2c1e3b"' }>
                                            <li class="link">
                                                <a href="components/LoginPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OptionSetSelectionPageModule.html" data-type="entity-link">OptionSetSelectionPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OptionSetSelectionPageModule-15254c4e321bc427fed0c4c805e9ee6c"' : 'data-target="#xs-components-links-module-OptionSetSelectionPageModule-15254c4e321bc427fed0c4c805e9ee6c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OptionSetSelectionPageModule-15254c4e321bc427fed0c4c805e9ee6c"' :
                                            'id="xs-components-links-module-OptionSetSelectionPageModule-15254c4e321bc427fed0c4c805e9ee6c"' }>
                                            <li class="link">
                                                <a href="components/OptionSetSelectionPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OptionSetSelectionPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrganisationUnitSearchPageModule.html" data-type="entity-link">OrganisationUnitSearchPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OrganisationUnitSearchPageModule-a6bd1e10f2e4c1affc5947737e2e73b9"' : 'data-target="#xs-components-links-module-OrganisationUnitSearchPageModule-a6bd1e10f2e4c1affc5947737e2e73b9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OrganisationUnitSearchPageModule-a6bd1e10f2e4c1affc5947737e2e73b9"' :
                                            'id="xs-components-links-module-OrganisationUnitSearchPageModule-a6bd1e10f2e4c1affc5947737e2e73b9"' }>
                                            <li class="link">
                                                <a href="components/OrganisationUnitSearchPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrganisationUnitSearchPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrganisationUnitSelectionPageModule.html" data-type="entity-link">OrganisationUnitSelectionPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OrganisationUnitSelectionPageModule-6a056a5075c733e13844728c01cb993a"' : 'data-target="#xs-components-links-module-OrganisationUnitSelectionPageModule-6a056a5075c733e13844728c01cb993a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OrganisationUnitSelectionPageModule-6a056a5075c733e13844728c01cb993a"' :
                                            'id="xs-components-links-module-OrganisationUnitSelectionPageModule-6a056a5075c733e13844728c01cb993a"' }>
                                            <li class="link">
                                                <a href="components/OrganisationUnitSelectionPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrganisationUnitSelectionPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilePageModule.html" data-type="entity-link">ProfilePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProfilePageModule-edf82cc0c62e3b4d1e57143c978b6b59"' : 'data-target="#xs-components-links-module-ProfilePageModule-edf82cc0c62e3b4d1e57143c978b6b59"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfilePageModule-edf82cc0c62e3b4d1e57143c978b6b59"' :
                                            'id="xs-components-links-module-ProfilePageModule-edf82cc0c62e3b4d1e57143c978b6b59"' }>
                                            <li class="link">
                                                <a href="components/ProfilePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfilePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReportsPageModule.html" data-type="entity-link">ReportsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ReportsPageModule-d69116806a847fba51c8521cf5048408"' : 'data-target="#xs-components-links-module-ReportsPageModule-d69116806a847fba51c8521cf5048408"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ReportsPageModule-d69116806a847fba51c8521cf5048408"' :
                                            'id="xs-components-links-module-ReportsPageModule-d69116806a847fba51c8521cf5048408"' }>
                                            <li class="link">
                                                <a href="components/ReportsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsPageModule.html" data-type="entity-link">SettingsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SettingsPageModule-8678a8634faa82d2427696933a123267"' : 'data-target="#xs-components-links-module-SettingsPageModule-8678a8634faa82d2427696933a123267"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SettingsPageModule-8678a8634faa82d2427696933a123267"' :
                                            'id="xs-components-links-module-SettingsPageModule-8678a8634faa82d2427696933a123267"' }>
                                            <li class="link">
                                                <a href="components/SettingsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedComponentsModule.html" data-type="entity-link">SharedComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedComponentsModule-bcd81fd31ddccf96172dcc2dc3cd6de3"' : 'data-target="#xs-components-links-module-SharedComponentsModule-bcd81fd31ddccf96172dcc2dc3cd6de3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedComponentsModule-bcd81fd31ddccf96172dcc2dc3cd6de3"' :
                                            'id="xs-components-links-module-SharedComponentsModule-bcd81fd31ddccf96172dcc2dc3cd6de3"' }>
                                            <li class="link">
                                                <a href="components/AgeInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AgeInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BarcodeInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BarcodeInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BooleanInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BooleanInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CoordinateInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CoordinateInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DateInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DateTimeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateTimeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmailInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmailInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NumericalInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NumericalInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OptionSetInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OptionSetInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrganisationUnitInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrganisationUnitInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrganisationUnitTreeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrganisationUnitTreeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PercentageInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PercentageInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhoneNumberInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PhoneNumberInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgressBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProgressBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RadioButtonComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RadioButtonComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TextInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrueOnlyInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrueOnlyInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UnitIntervalInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UnitIntervalInputComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SyncPageModule.html" data-type="entity-link">SyncPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SyncPageModule-5931aa66d9be34cfe144a830bdb5cbbb"' : 'data-target="#xs-components-links-module-SyncPageModule-5931aa66d9be34cfe144a830bdb5cbbb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SyncPageModule-5931aa66d9be34cfe144a830bdb5cbbb"' :
                                            'id="xs-components-links-module-SyncPageModule-5931aa66d9be34cfe144a830bdb5cbbb"' }>
                                            <li class="link">
                                                <a href="components/SyncPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SyncPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TabsPageModule.html" data-type="entity-link">TabsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TabsPageModule-d0e70b4c53d67c5b22fbe23ff7138017"' : 'data-target="#xs-components-links-module-TabsPageModule-d0e70b4c53d67c5b22fbe23ff7138017"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TabsPageModule-d0e70b4c53d67c5b22fbe23ff7138017"' :
                                            'id="xs-components-links-module-TabsPageModule-d0e70b4c53d67c5b22fbe23ff7138017"' }>
                                            <li class="link">
                                                <a href="components/TabsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TabsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TrackerCapturePageModule.html" data-type="entity-link">TrackerCapturePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TrackerCapturePageModule-aaf494b8681ef31c301f9c008a62bd38"' : 'data-target="#xs-components-links-module-TrackerCapturePageModule-aaf494b8681ef31c301f9c008a62bd38"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TrackerCapturePageModule-aaf494b8681ef31c301f9c008a62bd38"' :
                                            'id="xs-components-links-module-TrackerCapturePageModule-aaf494b8681ef31c301f9c008a62bd38"' }>
                                            <li class="link">
                                                <a href="components/TrackerCapturePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrackerCapturePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TranslationSelectionPageModule.html" data-type="entity-link">TranslationSelectionPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TranslationSelectionPageModule-a46e29e5bc004cee8583bba644a8e1a2"' : 'data-target="#xs-components-links-module-TranslationSelectionPageModule-a46e29e5bc004cee8583bba644a8e1a2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TranslationSelectionPageModule-a46e29e5bc004cee8583bba644a8e1a2"' :
                                            'id="xs-components-links-module-TranslationSelectionPageModule-a46e29e5bc004cee8583bba644a8e1a2"' }>
                                            <li class="link">
                                                <a href="components/TranslationSelectionPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TranslationSelectionPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AddCurrentUser.html" data-type="entity-link">AddCurrentUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryComboEntity.html" data-type="entity-link">CategoryComboEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClearCurrentUser.html" data-type="entity-link">ClearCurrentUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConstantEntity.html" data-type="entity-link">ConstantEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataElementEntity.html" data-type="entity-link">DataElementEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSetCompletenessEntity.html" data-type="entity-link">DataSetCompletenessEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSetDesignEntity.html" data-type="entity-link">DataSetDesignEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSetElementEntity.html" data-type="entity-link">DataSetElementEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSetEntity.html" data-type="entity-link">DataSetEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSetIndicatorEntity.html" data-type="entity-link">DataSetIndicatorEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSetOperandEntity.html" data-type="entity-link">DataSetOperandEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSetSectionEntity.html" data-type="entity-link">DataSetSectionEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataSetSourceEntity.html" data-type="entity-link">DataSetSourceEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataStoreEntity.html" data-type="entity-link">DataStoreEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/DataValueEntity.html" data-type="entity-link">DataValueEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnrollmentEntity.html" data-type="entity-link">EnrollmentEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventEntity.html" data-type="entity-link">EventEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/IndicatorEntity.html" data-type="entity-link">IndicatorEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrganisationUnitEntity.html" data-type="entity-link">OrganisationUnitEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramEntity.html" data-type="entity-link">ProgramEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramIndicatorEntity.html" data-type="entity-link">ProgramIndicatorEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramOrganisationUnitEntity.html" data-type="entity-link">ProgramOrganisationUnitEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramProgramStageEntity.html" data-type="entity-link">ProgramProgramStageEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramProgramTrackedEntityAttributeEntity.html" data-type="entity-link">ProgramProgramTrackedEntityAttributeEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramRuleActionEntity.html" data-type="entity-link">ProgramRuleActionEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramRuleEntity.html" data-type="entity-link">ProgramRuleEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramRuleVariableEntity.html" data-type="entity-link">ProgramRuleVariableEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramStageEntryFormEntity.html" data-type="entity-link">ProgramStageEntryFormEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramStageSectionEntity.html" data-type="entity-link">ProgramStageSectionEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProgramTrackedEntityAttributeEntity.html" data-type="entity-link">ProgramTrackedEntityAttributeEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportDesignEntity.html" data-type="entity-link">ReportDesignEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReportEntity.html" data-type="entity-link">ReportEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/SectionDataElementEntity.html" data-type="entity-link">SectionDataElementEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/SectionEntity.html" data-type="entity-link">SectionEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/SectionIndicatorEntity.html" data-type="entity-link">SectionIndicatorEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentUser.html" data-type="entity-link">SetCurrentUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentUserColorSettings.html" data-type="entity-link">SetCurrentUserColorSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/SmsCommandEntity.html" data-type="entity-link">SmsCommandEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrackedEntityAttributeEntity.html" data-type="entity-link">TrackedEntityAttributeEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrackedEntityAttributeValueEntity.html" data-type="entity-link">TrackedEntityAttributeValueEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrackedEntityInstanceEntity.html" data-type="entity-link">TrackedEntityInstanceEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrackerRegistrationFormEntity.html" data-type="entity-link">TrackerRegistrationFormEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCurrentUser.html" data-type="entity-link">UpdateCurrentUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationRuleEntity.html" data-type="entity-link">ValidationRuleEntity</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppColorService.html" data-type="entity-link">AppColorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppConfigService.html" data-type="entity-link">AppConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppTransalationsService.html" data-type="entity-link">AppTransalationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BarcodeReaderService.html" data-type="entity-link">BarcodeReaderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategoryComboService.html" data-type="entity-link">CategoryComboService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CurrentUserEffects.html" data-type="entity-link">CurrentUserEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataElementService.html" data-type="entity-link">DataElementService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataSetService.html" data-type="entity-link">DataSetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataStoreManagerService.html" data-type="entity-link">DataStoreManagerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EncryptionService.html" data-type="entity-link">EncryptionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GeolocationService.html" data-type="entity-link">GeolocationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpClientService.html" data-type="entity-link">HttpClientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IndicatorService.html" data-type="entity-link">IndicatorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalInstanceService.html" data-type="entity-link">LocalInstanceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStorageService.html" data-type="entity-link">LocalStorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NetworkService.html" data-type="entity-link">NetworkService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrganisationUnitService.html" data-type="entity-link">OrganisationUnitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProgramRuleEngineService.html" data-type="entity-link">ProgramRuleEngineService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProgramService.html" data-type="entity-link">ProgramService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProgramStageSectionService.html" data-type="entity-link">ProgramStageSectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SectionService.html" data-type="entity-link">SectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingService.html" data-type="entity-link">SettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SmsCommandService.html" data-type="entity-link">SmsCommandService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StandardResportService.html" data-type="entity-link">StandardResportService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SystemInformationService.html" data-type="entity-link">SystemInformationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SystemSettingService.html" data-type="entity-link">SystemSettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToasterMessagesService.html" data-type="entity-link">ToasterMessagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserAuthorizationService.html" data-type="entity-link">UserAuthorizationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidationRuleService.html" data-type="entity-link">ValidationRuleService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppColor.html" data-type="entity-link">AppColor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppColorObject.html" data-type="entity-link">AppColorObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppItem.html" data-type="entity-link">AppItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppSetting.html" data-type="entity-link">AppSetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarcodeSetting.html" data-type="entity-link">BarcodeSetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BarcodeSettings.html" data-type="entity-link">BarcodeSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CategoryCombo.html" data-type="entity-link">CategoryCombo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CategoryOptionCombo.html" data-type="entity-link">CategoryOptionCombo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Constant.html" data-type="entity-link">Constant</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Coordinate.html" data-type="entity-link">Coordinate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurrentAge.html" data-type="entity-link">CurrentAge</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurrentUser.html" data-type="entity-link">CurrentUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurrentUserState.html" data-type="entity-link">CurrentUserState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataElement.html" data-type="entity-link">DataElement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSet.html" data-type="entity-link">DataSet</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSetCompleteness.html" data-type="entity-link">DataSetCompleteness</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSetDesign.html" data-type="entity-link">DataSetDesign</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSetElement.html" data-type="entity-link">DataSetElement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSetIndicator.html" data-type="entity-link">DataSetIndicator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSetOperand.html" data-type="entity-link">DataSetOperand</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSetSection.html" data-type="entity-link">DataSetSection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataSetSource.html" data-type="entity-link">DataSetSource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataStore.html" data-type="entity-link">DataStore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataValue.html" data-type="entity-link">DataValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Enrollment.html" data-type="entity-link">Enrollment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntryFormSetting.html" data-type="entity-link">EntryFormSetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventDataValue.html" data-type="entity-link">EventDataValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Events.html" data-type="entity-link">Events</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Indicator.html" data-type="entity-link">Indicator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalInstance.html" data-type="entity-link">LocalInstance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginFormField.html" data-type="entity-link">LoginFormField</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Option.html" data-type="entity-link">Option</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OptionSet.html" data-type="entity-link">OptionSet</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrganisationUnit.html" data-type="entity-link">OrganisationUnit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Program.html" data-type="entity-link">Program</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramIndicator.html" data-type="entity-link">ProgramIndicator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramOrganisationUnit.html" data-type="entity-link">ProgramOrganisationUnit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramProgramStage.html" data-type="entity-link">ProgramProgramStage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramProgramTrackedEntityAttribute.html" data-type="entity-link">ProgramProgramTrackedEntityAttribute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramRule.html" data-type="entity-link">ProgramRule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramRuleAction.html" data-type="entity-link">ProgramRuleAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramRuleVariable.html" data-type="entity-link">ProgramRuleVariable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramStageEntryForm.html" data-type="entity-link">ProgramStageEntryForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramStageSection.html" data-type="entity-link">ProgramStageSection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramTrackedEntityAttribute.html" data-type="entity-link">ProgramTrackedEntityAttribute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueueManager.html" data-type="entity-link">QueueManager</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Report.html" data-type="entity-link">Report</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ReportDesign.html" data-type="entity-link">ReportDesign</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Section.html" data-type="entity-link">Section</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectionDataElement.html" data-type="entity-link">SectionDataElement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectionIndicator.html" data-type="entity-link">SectionIndicator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SmsCode.html" data-type="entity-link">SmsCode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SmsCommand.html" data-type="entity-link">SmsCommand</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/State.html" data-type="entity-link">State</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SynchronizationSetting.html" data-type="entity-link">SynchronizationSetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SystemSettings.html" data-type="entity-link">SystemSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrackedEntityAttribute.html" data-type="entity-link">TrackedEntityAttribute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrackedEntityAttributeValue.html" data-type="entity-link">TrackedEntityAttributeValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrackedEntityInstance.html" data-type="entity-link">TrackedEntityInstance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrackerRegistrationForm.html" data-type="entity-link">TrackerRegistrationForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Translation.html" data-type="entity-link">Translation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationRule.html" data-type="entity-link">ValidationRule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ValidationRuleSide.html" data-type="entity-link">ValidationRuleSide</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});