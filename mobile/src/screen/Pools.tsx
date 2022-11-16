import { useCallback, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { api } from "../services/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools() {
  const [isPoolsLoading, setIsPoolsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardProps[]>([])

  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPools() {
    try {
      setIsPoolsLoading(true);
      const response = await api.get('/pools')
      setPools(response.data.pools);
    } catch (error) {
      console.log(error);

      toast.show({
        title:'Não foi possível carregar os bolões',
        placement:'bottom',
        bgColor:'red.500'
      });
    } finally {
      setIsPoolsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []))

  return(
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" onShare={() => {}}/>
      
        <VStack mt={6} mx={5} pb={4} mb={4} borderBottomWidth={1} borderBottomColor="gray.600">
        <Button 
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md"/>}
          onPress={() => navigate('find')}
        />
        </VStack>

        {
          isPoolsLoading ? <Loading /> :
          <FlatList 
            data={pools}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <PoolCard 
                data={item}
                onPress={() => navigate('details', {id: item.id})}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{pb : 84}}
            ListEmptyComponent={() => <EmptyPoolList />}
            px={5}
          />}
      
    </VStack>
  );
}