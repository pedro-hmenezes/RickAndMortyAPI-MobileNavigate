import 'react-native-gesture-handler';
import * as React from 'react';
import { View, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme as NavTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Provider as PaperProvider,
  MD3LightTheme,
  Appbar,
  Text,
  Button,
  Card,
  Icon,
  ActivityIndicator,
  Chip,
  Searchbar
} from 'react-native-paper';

// --- 1. INTERFACES (TIPOS DE DADOS) ---
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  location: { name: string };
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string; // Ex: "S01E01"
}

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}

// --- 2. TEMA ---
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#00b5cc', // Azul Rick
    secondary: '#b2df28', // Verde Portal
    background: '#ffffff',
    surface: '#f8f9fa',
  },
};

// --- 3. NAVEGAÇÃO ---
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

// --- 4. TELAS ---

// === TELA 1: PERSONAGENS (Já validada) ===
function CharactersScreen({ navigation }: any) {
  const [data, setData] = React.useState<Character[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');

  const carregarDados = async () => {
    setLoading(true);
    try {
      let url = `https://rickandmortyapi.com/api/character/?name=${searchQuery}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const response = await fetch(url);
      const json = await response.json();
      setData(json.results || []);
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(carregarDados, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, statusFilter]);

  return (
    <View style={styles.container}>
      <View style={styles.filterArea}>
        <Searchbar
          placeholder="Nome do personagem..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <Chip selected={statusFilter === ''} onPress={() => setStatusFilter('')} icon="account-group">Todos</Chip>
            <Chip selected={statusFilter === 'alive'} onPress={() => setStatusFilter('alive')} icon="heart-pulse" style={statusFilter === 'alive' ? {backgroundColor:'#e6fffa'}:{}}>Vivos</Chip>
            <Chip selected={statusFilter === 'dead'} onPress={() => setStatusFilter('dead')} icon="skull" style={statusFilter === 'dead' ? {backgroundColor:'#ffe6e6'}:{}}>Mortos</Chip>
            <Chip selected={statusFilter === 'unknown'} onPress={() => setStatusFilter('unknown')} icon="help-circle">Desconhecido</Chip>
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => navigation.navigate('Detalhes', { item })}>
              <View style={styles.row}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon source="circle" size={10} color={item.status === 'Alive' ? 'green' : item.status === 'Dead' ? 'red' : 'gray'} />
                      <Text variant="bodySmall" style={{ marginLeft: 5, color: '#666' }}>{item.status} - {item.species}</Text>
                  </View>
                </View>
                <Icon source="chevron-right" size={24} color="#ccc" />
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

// === TELA 2: EPISÓDIOS (NOVA!) ===
function EpisodesScreen() {
  const [data, setData] = React.useState<Episode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const fetchEpisodes = async () => {
    setLoading(true);
    try {
      // Busca episódios por nome
      const response = await fetch(`https://rickandmortyapi.com/api/episode?name=${search}`);
      const json = await response.json();
      setData(json.results || []);
    } catch (err) { setData([]); } 
    finally { setLoading(false); }
  };

  React.useEffect(() => {
    const time = setTimeout(fetchEpisodes, 500);
    return () => clearTimeout(time);
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.filterArea}>
        <Searchbar placeholder="Buscar episódio..." onChangeText={setSearch} value={search} style={styles.searchBar} />
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title 
                title={item.episode} 
                subtitle={item.air_date}
                left={(props) => <Icon source="television-classic" size={30} color={theme.colors.primary} />}
              />
              <Card.Content>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#444' }}>
                   {item.name}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
}

// === TELA 3: LOCAIS (NOVA!) ===
function LocationsScreen() {
  const [data, setData] = React.useState<Location[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/location?name=${search}`);
      const json = await response.json();
      setData(json.results || []);
    } catch (err) { setData([]); } 
    finally { setLoading(false); }
  };

  React.useEffect(() => {
    const time = setTimeout(fetchLocations, 500);
    return () => clearTimeout(time);
  }, [search]);

  // Define ícone baseado no tipo do lugar
  const getIcon = (type: string) => {
    if (type === 'Planet') return 'earth';
    if (type === 'Space station') return 'space-station';
    return 'map-marker-question';
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterArea}>
        <Searchbar placeholder="Buscar planeta/local..." onChangeText={setSearch} value={search} style={styles.searchBar} />
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={{ backgroundColor: '#e0f7fa', padding: 10, borderRadius: 50, marginRight: 15 }}>
                    <Icon source={getIcon(item.type)} size={30} color="#0097a7" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                    <Text variant="bodySmall" style={{ color: '#666' }}>{item.type} • {item.dimension}</Text>
                    <View style={{ marginTop: 5 }}>
                        <Chip icon="account-group" compact textStyle={{ fontSize: 10 }} style={{ alignSelf: 'flex-start', height: 26 }}>
                            {item.residents.length} habitantes
                        </Chip>
                    </View>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

// === TELA DETALHES (Mantida) ===
function DetailsScreen({ route, navigation }: any) {
  const { item } = route.params as { item: Character };
  const statusColor = item.status === 'Alive' ? '#55cc44' : item.status === 'Dead' ? '#d63d2e' : '#9e9e9e';

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: 'white' }}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Ficha Técnica" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
        <Image source={{ uri: item.image }} style={styles.bigImage} />
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginTop: 15, textAlign: 'center' }}>{item.name}</Text>
        
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <Chip icon="heart-pulse" textStyle={{ color: statusColor }}>{item.status}</Chip>
            <Chip icon="alien">{item.species}</Chip>
        </View>

        <Card style={{ width: '100%', marginTop: 20 }}>
            <Card.Title title="Localização" left={(props) => <Icon source="map-marker" {...props} />} />
            <Card.Content><Text>{item.location.name}</Text></Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

// --- 5. NAVEGAÇÃO PRINCIPAL ---
function TabsNavigation() {
  return (
    <Tabs.Navigator 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: { height: Platform.OS === 'ios' ? 74 : 60, paddingBottom: Platform.OS === 'ios' ? 20 : 8 }
      }}
    >
      <Tabs.Screen 
        name="Personagens" 
        component={CharactersScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Icon source="account-group" color={color} size={size} /> }}
      />
      <Tabs.Screen 
        name="Episódios" 
        component={EpisodesScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Icon source="television-play" color={color} size={size} /> }}
      />
      <Tabs.Screen 
        name="Locais" 
        component={LocationsScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Icon source="earth" color={color} size={size} /> }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={theme.colors.primary} />
        <NavigationContainer theme={NavTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabsNavigation} />
            <Stack.Screen name="Detalhes" component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

// --- 6. ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  filterArea: {
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 10,
    ...Platform.select({
      android: { elevation: 2 },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 4 },
    }),
  },
  searchBar: { marginBottom: 10, backgroundColor: '#f0f2f5', height: 45 },
  card: {
    marginBottom: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 12,
    ...Platform.select({
      android: { elevation: 3 },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6 },
    }),
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  bigImage: {
    width: '60%',
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: 'white',
    resizeMode: 'cover',
  },
});