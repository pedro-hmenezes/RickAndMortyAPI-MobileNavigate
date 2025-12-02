# Wiki Rick and Morty - React Native App

Este projeto é um aplicativo móvel desenvolvido em React Native (Expo) com TypeScript, focado no consumo de API REST e navegação entre telas.

## Funcionalidades

### Catálogo de Personagens
- Listagem com fotos e status (Vivo/Morto).
- Filtros inteligentes (Chips) e barra de pesquisa.
- Navegação para detalhes do personagem.

### Guia de Episódios
- Busca de episódios por nome.
- Exibição de código (S01E01) e data de lançamento.

### Explorador de Locais
- Listagem de planetas e estações espaciais.
- Contador de habitantes por local.

## Tecnologias Utilizadas

- **Core:** React Native, Expo, TypeScript.
- **UI Library:** [React Native Paper](https://callstack.github.io/react-native-paper/) (Material Design).
- **Navegação:** React Navigation (Stack & Bottom Tabs).
- **Dados:** [The Rick and Morty API](https://rickandmortyapi.com/).

## Como Rodar

### Pré-requisitos
- Node.js instalado.

### Instalação
```npm install```

### Execução
```npx expo start```

## Estrutura do Código

O código está concentrado no `App.tsx` para fins didáticos, dividido em:

- **Interfaces:** Tipagem dos dados da API.
- **Componentes de Tela:** `CharactersScreen`, `EpisodesScreen`, `LocationsScreen`.
- **Navegação:** Configuração de `TabsNavigator` e `StackNavigator`.

Código por Pedro Menezes
