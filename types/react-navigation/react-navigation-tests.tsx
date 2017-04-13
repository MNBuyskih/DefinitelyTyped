import {Component} from "react";
import {AppRegistry, Text, Button, View} from "react-native";
import {StackNavigator, NavigationProps} from "react-navigation";

class HomeScreen extends Component<NavigationProps<TestProps, TestState>, TestState> {
    static navigationOptions = {
        title: "Welcome",
    };

    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        return (
            <View>
                <Button
                    onPress={() => navigate('Chat')}
                    title="Chat with Lucy"
                />
                <Button
                    onPress={() => navigate('Chat', {user: params.user})}
                    title="Chat with Lucy"
                />
            </View>
        );
    }
}

interface TestProps {
}
interface TestState {
    params: { user: string };
}

const SimpleApp = StackNavigator({
    Home: {screen: HomeScreen},
});

AppRegistry.registerComponent('app', () => SimpleApp);

// Nesting Navigators

import {TabNavigator} from "react-navigation";

class RecentChatsScreen extends Component<{}, {}> {
    render() {
        return <Text>List of recent chats</Text>
    }
}

class AllContactsScreen extends Component<{}, {}> {
    render() {
        return <Text>List of all contacts</Text>
    }
}

const MainScreenNavigator = TabNavigator({
    Recent: {screen: RecentChatsScreen},
    All: {screen: AllContactsScreen},
});

MainScreenNavigator.navigationOptions = {
    title: 'My Chats',
};
