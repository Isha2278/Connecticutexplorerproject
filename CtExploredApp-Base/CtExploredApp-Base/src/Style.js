import { StyleSheet, Dimensions, StatusBar, Platform } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const windowWidth = Dimensions.get('window').width;

const imageWidth = windowWidth * 0.8; // 60% of screen width
const aspectRatio = 16 / 10; // Example aspect ratio, change as needed
const imageHeight = imageWidth / aspectRatio;
const marginLeft = windowWidth * 0.1; // 20% margin on the left
const marginRight = windowWidth * 0.1; // 20% margin on the right


// Calculate dynamic margin and padding based on screen width
const dynamicMargin = windowWidth > 600 ? wp('5%') : wp('10%');
const dynamicPadding = windowWidth > 600 ? wp('3%') : wp('5%');

const styles = StyleSheet.create({
    AndroidSafeArea : {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    // UNIVERSAL
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
    },
    // AUTH
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        height: '40%',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
    },
    loginOptions: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    loginButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    copyText: {
        margin: 5,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    copyInstructions: {
        margin: 5,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // EXPLORED STYLES
    ExploredAndSavedContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    flatListContainer: {
        flexGrow: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(2), // Add responsive margin
    },
    mainTitle: {
        fontSize: windowWidth < 600 ? 28 : 36, // Adjust font size as needed
        fontWeight: 'normal',
        textAlign: 'center', // Center text horizontally
    },
    itemContainer: {
        marginBottom: hp(2), // Add responsive margin
    },
    ExploredTitle: {
        fontSize: windowWidth < 600 ? 24 : 36, // Add responsive font size
        padding: dynamicPadding,
        marginBottom: dynamicMargin,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listImage: {
        height: windowWidth < 600 ? hp(20) : hp(20),
        width: windowWidth < 600 ? wp(80) : wp(40),
        borderRadius: 6,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    CTExploredHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 25.9,
        position: 'relative', // Add position: 'relative'
    },
    centerView: {
        position: 'absolute', // Add position: 'absolute'
        left: 0, // Align to the left
        right: 0, // Align to the right
        alignItems: 'center',
    },
    headerImage: {
        height: windowWidth < 600 ? 50 : 80,
        resizeMode: 'contain',
        width: windowWidth < 600 ? 180 : 240,
    },
    userButton: {
        position: 'absolute', // Add position: 'absolute'
        right: 10, // Adjust as needed
        padding: 10,
    },
    alphabetSelector: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        paddingHorizontal: 10,
    },
    alphabetLetter: {
        fontSize: 14,
        marginVertical: 2,
    },
    refreshButton: {
        padding: 10,
    },
    // LEADERBOARD STYLES
    LeaderContainer: {
        flex: 1,
        padding: dynamicPadding,
        backgroundColor: '#fff',
    },
    LeaderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center horizontally
        marginVertical: windowWidth < 600 ? dynamicMargin * 0.2 : dynamicMargin / 2, // Adjusted marginBottom
        paddingVertical: dynamicPadding * 0.2, // Adjusted paddingBottom
    },
    iconStyle: {
        marginRight: 8, // Adjust the spacing between icon and text
        marginLeft: 8, // Adjust the spacing between text and icon
    },
    LeaderTitle: {
        marginVertical: 10,
        alignSelf: 'center', // Center horizontally
        fontSize: 24,
        fontWeight: 'bold',
    },
    scoreContainer: {
        padding: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },

    columnTitlesContainer: {
        flexDirection: 'row',
        paddingHorizontal: 25,
        marginBottom: 5,
    },

    flatlistBorder: {
        borderWidth: 1, // Add border
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: '#ccc', // Add border color
    },
    flatlistContainer:{
        paddingBottom: 10,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: windowWidth < 600 ? dynamicPadding * 1 : dynamicPadding,
        backgroundColor: '#fff',
        borderRadius: 8,
        //marginHorizontal: windowWidth > 600 ? dynamicMargin : 0,
        marginBottom: windowWidth > 600 ? dynamicMargin * 0.4 : dynamicMargin * 0.2, // Adjusted marginBottom
        borderColor: '#ccc', // Add borderBottomColor
        //borderWidth: 1, // Add borderWidth
    },
    currentUser: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: windowWidth < 600 ? dynamicPadding * 1 : dynamicPadding,
        backgroundColor: '#fff',
        borderRadius: 8,
        //marginHorizontal: windowWidth > 600 ? dynamicMargin : 0,
        marginBottom: windowWidth > 600 ? dynamicMargin * 0.4 : dynamicMargin * 0.2, // Adjusted marginBottom
        borderColor: '#ccc', // Add borderBottomColor
        borderWidth: 1, // Add borderWidth
        margin: 10,
        
    },

    rankContainer: {
        flex: windowWidth < 600 ? 0.4 : 0.2, // 50% of the screen width for smaller screens, 20% for larger screens
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //borderWidth: 1,
        flexWrap: 'nowrap', // Prevent text from wrapping onto the next line
    },
    userInfoContainer: {
        flex: windowWidth < 600 ? 0.6 : 0.8, // 60% of the screen width for smaller screens, 80% for larger screens
        flexDirection: 'row',
        alignItems: 'center',
        //borderWidth: 1,
        paddingHorizontal: 10,
    },
    userScoreContainer: {
        flex: windowWidth < 600 ? 0.2 : 0.1, // 20% of the screen width for smaller screens, 10% for larger screens
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        //borderWidth: 1,
        paddingHorizontal: 10,
    },


    imageStyle: {
        marginRight: dynamicMargin,
        width: 30, // Adjust the width of the image
        height: 30, // Adjust the height of the image
    },
    rank: {
        padding: 10,
        //borderWidth: 2, // Add borderWidth
        borderColor: '#ccc', // Add borderColor
        //borderRadius: 30, // Add borderRadius
        fontSize: windowWidth > 600 ? 26 : 14,
        fontWeight: 'bold',
        marginRight: dynamicMargin,
    },
    username: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: windowWidth > 600 ? 26 : 14,
        marginRight: dynamicMargin,
    },
    scoreText: {
        
        fontSize: windowWidth > 600 ? 24 : 14,
        fontWeight: 'bold',
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: windowWidth > 600 ? 24 : 15,
    },
    picker: {
        paddingHorizontal: windowWidth > 600 ? dynamicPadding * 4 : 0,
    },
    logout: {
        paddingHorizontal: windowWidth > 600 ? dynamicPadding * 9 : dynamicPadding * 6,
    },

    // MAP STYLES
    map: {
        flex: 2,
        width: '100%',
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: windowWidth < 600 ? 0 - 90 : 0 - 120,
    },
    MapGuideTitleContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    marker: {
        backgroundColor: 'blue',
        padding: 5,
        width: 30,
        height: 30,
        borderRadius: 15,
        borderColor: 'blue',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerText: {
        fontWeight: 'bold',
        color: 'white',
    },
    // DETAIL VIEW STYLES
    header: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    image: {
        width: imageWidth,
        height: imageHeight,
        marginLeft,
        marginRight,
        borderRadius: 6, // Adjust the border radius as needed    
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    description: {
        fontSize: windowWidth < 600 ? 18 : 24,
        lineHeight: 24,
        color: '#333',
        marginTop: windowWidth < 600 ? 0 : hp('2%'),
        paddingHorizontal: windowWidth < 600 ? 0 : wp('5%')
    },
    mapMarkerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 10,
        marginBottom: windowWidth < 600 ? 16 : 24
    },
    mapMarkerText: {
        marginLeft: 8,
        fontSize: windowWidth < 600 ? 16 : 24, // Add responsive font size
        color: '#007BFF',
    },
    socialLinksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 5,
    },
    socialLink: {
        alignItems: 'center',
    },
    socialIcon: {
        marginBottom: 5,
    },
    socialText: {
        fontSize: 12,
    },
    // SAVED STYLES
    SavedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    // HEADER STYLES
    headerBC: {
        backgroundColor: 'white', // Customize the background color of the header
    },
    logo: {
        width: 30,
        height: 30,
        margin: 10,
    },
    // Map Guide
    mapGuideContainer: {
        position: 'absolute',
        bottom: '5%',
        width: '100%',
        alignItems: 'center',
        elevation: 5,
    },
    mapGuideInnerContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    mapGuideTextContainer: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    mapGuideTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    mapGuideButtonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    mapGuideButton: {
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    mapGuideBlueButton: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 40,
    },
    mapGuideImageButton: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    mapGuideImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    visible: {
        display: 'none',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        width: windowWidth < 600 ? '80%' : '50%', // Adjust modal width
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    copyButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    copyButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default styles;
