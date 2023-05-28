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
        "com.google.collections:google-collections:1.0=a0;\n" +
        "guru.nidi:graphviz-java:0.18.1=a1;\n" +
        "com.google.code.findbugs:jsr305:3.0.2=a2;\n" +
        "org.slf4j:jcl-over-slf4j:1.7.30=a3;\n" +
        "org.slf4j:jul-to-slf4j:1.7.30=a4;\n" +
        "org.webjars.npm:viz.js-graphviz-java:2.1.3=a5;\n" +
        "guru.nidi.com.kitfox:svgSalamander:1.1.3=a6;\n" +
        "org.slf4j:slf4j-api:1.7.30=a7;\n" +
        "org.apache.commons:commons-exec:1.3=a8;\n" +
        "net.arnx:nashorn-promise:0.1.1=a9;\n" +
        "net.sourceforge.plantuml:plantuml:8059=b0;\n" +
        "org.junit.jupiter:junit-jupiter-api:5.9.2=b1;\n" +
        "org.junit.platform:junit-platform-commons:1.9.2=b2;\n" +
        "org.junit:junit-bom:5.9.2=b3;\n" +
        "org.opentest4j:opentest4j:1.2.0=b4;\n" +
        "org.junit.platform:junit-platform-engine:1.9.2=b5;\n" +
        "org.junit.jupiter:junit-jupiter-engine:5.9.2=b6;\n" +
        "com.eclipsesource.j2v8:j2v8_linux_x86_64:4.6.0=b7;\n" +
        "org.projectlombok:lombok:1.18.24=b8;\n" +
        "org.apiguardian:apiguardian-api:1.1.2=b9;\n" +
        "org.slf4j:jul-to-slf4j:1.7.29=c0;\n" +
        "org.slf4j:slf4j-api:1.7.25=c1;\n" +
        "com.google.collections:google-collections:1.2=c2;\n" +
        "[mappings]\n" +
        "a1->a2;\n" +
        "a1->a3;\n" +
        "a1->a4;\n" +
        "a1->a5;\n" +
        "a1->a6;\n" +
        "a1->a7;\n" +
        "a1->a8;\n" +
        "a1->a9;\n" +
        "a4->a7;\n" +
        "a3->a7;\n" +
        "b1->b2;\n" +
        "b1->b3;\n" +
        "b1->b4;\n" +
        "b3->b5;\n" +
        "b3->b1;\n" +
        "b3->b6;\n" +
        "b3->b2;\n" +
        "b6->b5;\n" +
        "b6->b1;\n" +
        "b6->b3;\n" +
        "b5->b2;\n" +
        "b5->b4;\n" +
        "b5->b3;\n" +
        "b2->b3;\n" +
        "b1->b9;\n" +
        "b2->b9;\n" +
        "b2->a1;\n" +
        "b2->c0;\n" +
        "b3->a4;\n" +
        "b3->c2;\n";
}

export default AppStorage;