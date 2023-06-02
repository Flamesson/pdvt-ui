import Layouts from "./cytoscape/parameter/Layouts";

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
    static DATA_ACTIVE_TAB = "data active tab";
    static SEARCH_QUERY = "search query";
    static GENERAL_PARAMETERS = "general parameters";
    static PARAMETER_TOGGLE_UNLINKED_NODES_VISIBILITY = "toggle unlinked nodes visibility";
    static PARAMETER_TOGGLE_CIRCULAR_DEPENDENCIES_HIGHLIGHTING = "toggle circular dependencies highlighting";
    static PARAMETER_TOGGLE_MOST_LONG_PATH_HIGHLIGHTING = "toggle most long path highlighting";
    static PARAMETER_TOGGLE_USE_LICENSES = "toggle use licenses";
    static PARAMETER_TOGGLE_VERSIONS_COLLISIONS = "toggle versions collisions";
    static FIRST_OPEN = "first open";
    static RAW_DEPENDENCIES_LICENSES = "raw dependencies licenses";
    static DEPENDENCIES_LICENSES = "dependencies licenses";
    static HAS_VERSIONS = "has versions";
    static SAVED_CODE = "code";
    static SAVED_PASS_LENGTH = "pl";
    static ANALYSIS_PERFORMED = "analysis performed";

    static MOCK_TEXT_DATA = "[versioned][1]\n" +
        "[dictionary]\n" +
        "org.junit.jupiter:junit-jupiter-engine:5.9.2=a0;\n" +
        "org.junit.platform:junit-platform-engine:1.9.2=a1;\n" +
        "org.junit.jupiter:junit-jupiter-api:5.9.2=a2;\n" +
        "org.junit:junit-bom:5.9.2=a3;\n" +
        "org.opentest4j:opentest4j:1.2.0=a4;\n" +
        "org.junit.platform:junit-platform-commons:1.9.2=a5;\n" +
        "com.google.collections:google-collections:1.0=a6;\n" +
        "com.github.mizosoft.methanol:methanol:1.7.0=a7;\n" +
        "org.projectlombok:lombok:1.18.24=a8;\n" +
        "org.apiguardian:apiguardian-api:1.1.2=a9;\n" +
        "org.izumi.pdvt.gradle:pdvt:2.0.1=b0;\n" +
        "[mappings]\n" +
        "a0->a1;\n" +
        "a0->a2;\n" +
        "a0->a3;\n" +
        "a1->a4;\n" +
        "a1->a3;\n" +
        "a1->a5;\n" +
        "a5->a3;\n" +
        "a2->a5;\n" +
        "a2->a4;\n" +
        "a2->a3;\n" +
        "a3->a2;\n" +
        "a3->a0;\n" +
        "a3->a5;\n" +
        "a3->a1;\n" +
        "a2->a9;\n" +
        "a5->a9;\n" +
        "b0->a8;\n" +
        "b0->a6;\n" +
        "b0->a7;\n" +
        "b0->a2;\n" +
        "b0->a0;\n";

    static DEFAULT_LAYOUT = Layouts.COSE_BILKENT;
}

export default AppStorage;