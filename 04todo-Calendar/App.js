import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { FlatList, StyleSheet, Text, View, Image, KeyboardAvoidingView, Platform, Pressable, Keyboard, Alert} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {runPracticeDayjs} from './practice-dayjs';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useTodoList} from "./src/hook/use-todo-list";
import {useCalendar} from "./src/hook/use-calendar";
import { ITEM_WIDTH, bottomSpace, getCalendarColumns, statusBarHeight } from "./util";
import Calendar from "./Calendar";
import Margin from "./Margin";
import AddTodoInput from "./AddTodoInput";


export default function App() {
  const now = dayjs();
  const flatListRef = useRef(null);
  const {
    selectedDate,
    setSelectedDate,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    subtract1Month,
    add1Month,
  } = useCalendar(now);
  const {
    filteredTodoList,
    todoList,
    addTodo,
    removeTodo,
    toggleTodo,
    input,
    setInput,
    resetInput

  } = useTodoList(selectedDate);

  const columns = getCalendarColumns(selectedDate);

  const onPressLeftArrow = subtract1Month;
  const onPressHeaderDate = showDatePicker;
  const onPressRightArrow = add1Month;
  const onPressDate = setSelectedDate;

  ListHeaderComponent = () => {
    return(
      <View>
        <Calendar
          todoList={todoList}
          columns={columns}
          selectedDate ={selectedDate}
          onPressLeftArrow ={onPressLeftArrow}
          onPressHeaderDate ={onPressHeaderDate}
          onPressRightArrow ={onPressRightArrow}
          onPressDate = {onPressDate}
        />
        <Margin height={10}/>

{/* 밑의 View는 Calendar와 todoList 구분 점  */}
        <View 
          style = {{
            width: 4, 
            height: 4, 
            borderRadius: 4/2, 
            backgroundColor: "#a3a3a3",
            alignSelf: "center"
            }}/>

        <Margin height={15}/>    
      </View>
    )
  }

  const renderItem = ({item : todo}) => {
    const isSuccess = todo.isSuccess;
    const onPress = () => toggleTodo(todo.id);
    const onLongPress = () => {
      Alert.alert("삭제하시겠어요?", "",[
        {
          style:"cancel",
          text: "아니요"

        },

        {
          text: "네",
          onPress: () => removeTodo(todo.id),
        }
      ])
    };
    return(
      <Pressable 
        onPress={onPress}
        onLongPress={onLongPress}
        style={{
            flexDirection: "row",
            width:  ITEM_WIDTH, 
            alignSelf: "center",
            paddingVertical: 10,
            paddingHorizontal: 5,
            borderBottomWidth: 1,
            borderColor: "#a6a6a6",


            }}>
        <Text style={{flex: 1 ,fontSize: 14, color: "#595959"}}>{todo.content}</Text>
        <Ionicons 
          name="ios-checkmark" 
          size={17}
          color={isSuccess ? "#595959" : "#bfbfbf"}
          />
      </Pressable>
    )
  }

  const scrollToEnd = () => {
    setTimeout(()=> {
      flatListRef.current?.scrollToEnd({animated: true});
    },200);
  }

  const onPressAdd = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  }

  const onSubmitEditing = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  }

  const onFocus = () => {
    scrollToEnd();
  }

  useEffect(() => {
    runPracticeDayjs();
  }, []);
  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <Image
        source={{
          uri: "https://img.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1373-159.jpg?w=1060&t=st=1667524235~exp=1667524835~hmac=8a3d988d6c33a32017e280768e1aa4037b1ec8078c98fe21f0ea2ef361aebf2c"
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View>
            <FlatList
              ref={flatListRef}
              data={filteredTodoList}
              contentContainerStyle = {{paddingTop: statusBarHeight + 30}}
              ListHeaderComponent={ListHeaderComponent}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              
            />

            <AddTodoInput
              value={input}
              onChangeText={(ddd) => setInput(ddd)}
              placeholder={`${dayjs(selectedDate).format("MM.DD")}에 추가할 ToDo`}
              onPressAdd={onPressAdd}
              onSubmitEditing={onSubmitEditing}
              onFocus={onFocus}
            />
          </View>
        </KeyboardAvoidingView>

{/* 여기다가 마진 주면 키보드 올라올 때는 margin 적용 안되고 아무것도 안 누른 화면에서만 적용됨. */}
        <Margin height={bottomSpace}/>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});