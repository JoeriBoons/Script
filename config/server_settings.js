server_settings = {
    /**
     * Calculate how many more days we can attack in vacation mode
     */
    maxSitDays: 60,
    helpdeskUrl: "https://forum.tribalwars.nl/showthread.php?137674-8-11-GM-Algemeen-discussietopic-Sangu-Package",
    /**
     * This needs to be here for 'historical' reasons (Innogames versionchecker API remembers email on the server)
     * when in 'compatibility' mode (gray sangu icon). Also used in the crash report.
     */
    sangu: "sangu.be",
    sanguEmail: "package@sangu.be",
    /**
     * More then 500 [ cannot be sent in messages or pasted in the noteblock
     */
    allowedSquareBrackets: 500,
    /**
     * Are ajax calls allowed on this server
     */
    ajaxAllowed: true,
    /*
     * async: true on AJAX calls is only allowed when this property is true
     */
    asyncAjaxAllowed: false,
    /**
     * True: we add a direct link in the place to fill in coordinates. False: Show coords in an input field
     */
    coordinateLinkAllowed: false,
    /**
     * Can we fill in the coordinates directly in the place (using the url querystring) from troops overview
     */
    autoFillCoordinatesAllowed: true,
    scriptsDatabaseUrl: "http://www.twscripts.nl/"
};

//$.extend(server_settings, {
//    extraProperty: "yaye"
//});