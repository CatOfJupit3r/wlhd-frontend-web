import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';

import Achievements from './achievements';
import BasicUserInfo from './basic-user-info';
import Characters from './characters';
import JoinedLobbiesContainer from './joined-lobbies';
import Stats from './stats';

const ProfileBody = () => {
    return (
        <div className="container mx-auto px-4 py-6 pt-10">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Sidebar */}
                <div className="space-y-6">
                    <BasicUserInfo />
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="joined-lobbies" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="joined-lobbies">Lobbies</TabsTrigger>
                            <TabsTrigger value="characters">Characters</TabsTrigger>
                            <TabsTrigger value="achievements">Achievements</TabsTrigger>
                            <TabsTrigger value="stats">Stats</TabsTrigger>
                        </TabsList>

                        <TabsContent value="joined-lobbies" className="space-y-4">
                            <JoinedLobbiesContainer />
                        </TabsContent>
                        <TabsContent value="characters">
                            <Characters />
                        </TabsContent>
                        <TabsContent value="achievements">
                            <Achievements />
                        </TabsContent>
                        <TabsContent value="stats">
                            <Stats />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ProfileBody;
