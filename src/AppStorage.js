class AppStorage {
    static GRAPH_LAYOUT = "graph layout";
    static GRAPH_PARAMETERS_MODIFIED = "graph parameters modified";
    static GRAPH_PARAMS = "graph params";
    static DATA_FILE = "graph-file";
    static DATA_TEXT = "text-Data";
    static CURRENT_LOCALE_CODE = "i18nextLng";
    static FILTER_QUERY = "filter query";
    static PARAMETERS_OPENED = "parameters opened";
    static INFO_OPENED = "info opened";
    static HEADER_OPENED = "header opened";
    static PARAMETERS_ACTIVE_TAB = "parameters active tab";
    static SEARCH_QUERY = "search query";
    static GENERAL_PARAMETERS = "general parameters";
    static PARAMETER_TOGGLE_UNLINKED_NODES_VISIBILITY = "toggle unlinked nodes visibility";
    static PARAMETER_TOGGLE_CIRCULAR_DEPENDENCIES_HIGHLIGHTING = "toggle circular dependencies highlighting";
    static PARAMETER_TOGGLE_MOST_LONG_PATH_HIGHLIGHTING = "toggle most long path highlighting";
    static FIRST_OPEN = "first open";

    static MOCK_TEXT_DATA = "[unversioned][1]\n" +
        "[dictionary]\n" +
        "org.izumi.sample=a;\n" +
        "org.izumi.sample2=b;\n" +
        "org.springframework.core=c;\n" +
        "org.springframework.ioc=d;\n" +
        "[mappings]\n" +
        "a->b;b->c;\n" +
        "a->c;c->b;\n";
}

export default AppStorage;