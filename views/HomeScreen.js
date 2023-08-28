import * as React from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Platform, Pressable, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useTheme, Text } from 'react-native-paper';

import { useIsFocused } from '@react-navigation/native';

import * as SystemUI from 'expo-system-ui';

import formatCoursName from '../utils/FormatCoursName';
import getClosestGradeEmoji from '../utils/EmojiCoursName';
import getClosestColor from '../utils/ColorCoursName';

import { ListFilter } from 'lucide-react-native';

import {useState, useEffect, useRef} from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PapillonHeader from '../components/PapillonHeader';
import { PressableScale } from 'react-native-pressable-scale';

import { getRecap } from '../fetch/PronoteData/PronoteRecap';
import { getUser } from '../fetch/PronoteData/PronoteUser';
import { changeHomeworkState } from '../fetch/PronoteData/PronoteHomeworks';
import { set } from 'react-native-reanimated';

import { Link, File, Check } from 'lucide-react-native';

function HomeScreen({ navigation }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const currentDate = new Date(2022, 8, 22);

  const [nextClasses, setNextClasses] = React.useState(null);
  const [timetable, setTimetable] = React.useState(null);
  const [homeworks, setHomeworks] = React.useState(null);
  const [grades, setGrades] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [latestGrades, setLatestGrades] = React.useState(null);

  const [refreshCount, setRefreshCount] = React.useState(0);
  const [isHeadLoading, setIsHeadLoading] = React.useState(true);

  const isFocused = useIsFocused();

  // change header text and size
  React.useLayoutEffect(() => {
    navigation.setOptions({
      header: props => <HomeHeader props={props} user={user} timetable={timetable} navigation={navigation} />,
    });
  }, [navigation, timetable, user]);

  React.useEffect(() => {
    let forceReload = false;

    if (isHeadLoading) {
      forceReload = true;
    }

    // Fetch recap data
    getRecap(currentDate, forceReload).then(([timetableData, homeworksData, gradesData]) => {
      setIsHeadLoading(false);

      setTimetable(timetableData);
      setHomeworks(homeworksData);
      setGrades(gradesData);

      const nextClasses2 = getNextCours(timetable).nextClasses;
      setNextClasses(nextClasses2);

      // Calculate grade colors
      const updatedGrades = JSON.parse(gradesData).grades.reverse().map(grade => {
        const average = JSON.parse(gradesData).averages.find(average => average.subject.name === grade.subject.name);
        return {
          ...grade,
          color: average ? getClosestColor(average.color) : undefined,
        };
      });

      const latestGrades2 = updatedGrades.slice(0, 10);
      setLatestGrades(latestGrades2);
    });

    // Fetch user data
    getUser().then(result => {
      setUser(result);
    });

    const interval = setInterval(() => {
      const nextClasses2 = getNextCours(timetable).nextClasses;
      setNextClasses(nextClasses2);
    }, 300);
    return () => {
      clearInterval(interval);
    };
  }, [refreshCount]);

  // Refresh function
  const onRefresh = React.useCallback(() => {
    setIsHeadLoading(true);
    setRefreshCount(prevCount => prevCount + 1);
    setIsHeadLoading(false);
  }, []);

  return (
    <>
      { isFocused ?
        <StatusBar barStyle={'light-content'}/>
      : null }

      <ScrollView contentInsetAdjustmentBehavior="automatic" style={[styles.container, {backgroundColor: theme.dark ? "#000000" : "#f2f2f7"}]} contentContainerStyle={{alignItems: 'center', justifyContent: 'center', paddingTop: 12}}
      refreshControl={
        <RefreshControl progressViewOffset={28} refreshing={isHeadLoading} onRefresh={onRefresh} />
      }>

        {/* next classes */}
        { nextClasses ?
          <View style={[styles.nextClassesList, {backgroundColor : theme.dark ? '#151515' : '#ffffff'}]}>
            { nextClasses.map((cours, index) => (
              <View key={index} style={[styles.nextClassesListItemContainer, {borderBottomWidth: (index != nextClasses.length - 1) ? 1 : 0, borderBottomColor: theme.dark ? '#ffffff10' : '#00000010' }]}>
                <TouchableOpacity style={[styles.nextClassesListItem]} onPress={() => navigation.navigate('Lesson', { event: cours })}>
                  <Text numberOfLines={1} style={[styles.nextClassesListItemEmoji]}>{getClosestGradeEmoji(cours.subject.name)}</Text>

                  <Text numberOfLines={1} style={[styles.nextClassesListItemText]}>{formatCoursName(cours.subject.name)}</Text>

                  <Text numberOfLines={1} style={[styles.nextClassesListItemTime]}>{new Date(cours.start).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        : null }

        {/* homeworks */}
        { homeworks && homeworks.length > 0 ?
          <>
            <Text style={styles.ListTitle}>Travail à faire</Text>
            <View style={[styles.hwList, {backgroundColor : theme.dark ? '#151515' : '#ffffff'}]}>
              { homeworks.map((homework, index) => (
                <Hwitem key={index} index={index} homework={homework} homeworks={homeworks} navigation={navigation} theme={theme} />
              )) }
            </View>
          </>
        : null }

        {/* grades */}
        { latestGrades && latestGrades.length > 0 ?
          <>
            <Text style={styles.ListTitle}>Dernières notes</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.latestGradesList]}>
            {latestGrades.map((grade, index) => {
                return (
                  <PressableScale weight="light" activeScale={0.89} key={index} style={[styles.smallGradeContainer, {backgroundColor: theme.dark ? '#151515' : '#fff'}]} onPress={() => navigation.navigate('Grade', { grade: grade })}>
                    <View style={[styles.smallGradeSubjectContainer, {backgroundColor: grade.color}]}>
                      <Text style={[styles.smallGradeEmoji]}>{getClosestGradeEmoji(grade.subject.name)}</Text>
                      <Text style={[styles.smallGradeSubject]} numberOfLines={1} ellipsizeMode='tail'>{formatCoursName(grade.subject.name)}</Text>
                    </View>

                    <View style={[styles.smallGradeNameContainer]}>
                      { grade.description ?
                      <Text style={[styles.smallGradeName]} numberOfLines={3} ellipsizeMode='tail'>{grade.description}</Text>
                      :
                      <Text style={[styles.smallGradeName]}>Note en {formatCoursName(grade.subject.name)}</Text>
                      }

                      <Text style={[styles.smallGradeDate]}>{new Date(grade.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                    </View>

                    <View style={[styles.smallGradeValueContainer]}>
                      { grade.grade.significant == 0 ?
                        <Text style={[styles.smallGradeValue]}>{parseFloat(grade.grade.value).toFixed(2)}</Text>
                      : grade.grade.significant == 3 ?
                        <Text style={[styles.smallGradeValue]}>Abs.</Text>
                      :
                        <Text style={[styles.smallGradeValue]}>N.not</Text>
                      }
                      <Text style={[styles.smallGradeOutOf]}>/{grade.grade.out_of}</Text>
                    </View>
                  </PressableScale>
                );
              })}
            </ScrollView>
          </>
        : null }

        <View style={{height: 50}}></View>
      </ScrollView>
    </>
  );
}

const Hwitem = ({ index, homework, homeworks, navigation, theme }) => {
  const [thisHwChecked, setThisHwChecked] = useState(homework.done);

  const changeHwState = () => {
    console.log('change ' + homework.date + ' : ' + homework.id);
    changeHomeworkState(homework.date, homework.id).then((result) => {
      console.log(result);

      if (result.status == "not found") {
        setTimeout(() => {
          setThisHwChecked(homework.done);
        }, 100);
      }
    });
  };

  return (
    <PressableScale style={[styles.homeworkItemContainer, {backgroundColor: theme.dark ? "#191919" : "#ffffff"}]}>
      <View style={[styles.homeworkItem]}>
        <View style={[styles.checkboxContainer]}>
          <HwCheckbox checked={thisHwChecked} theme={theme} pressed={() => {
            setThisHwChecked(!thisHwChecked);
            changeHwState();
          }} />
        </View>
        <View style={[styles.hwItem]}>
          <View style={[styles.hwItemHeader]}>
            <View style={[styles.hwItemColor, {backgroundColor: getClosestColor(homework.background_color)}]}></View>
            <Text style={[styles.hwItemTitle, {color: theme.dark ? "#ffffff" : "#000000"}]}>{homework.subject.name}</Text>
          </View>
          <Text numberOfLines={4} style={[styles.hwItemDescription, {color: theme.dark ? "#ffffff" : "#000000"}]}>{homework.description}</Text>
        </View>
      </View>

      { homework.files.length > 0 ? (
        <View style={[styles.homeworkFiles]}>
          { homework.files.map((file, index) => (
            <View style={[styles.homeworkFileContainer, {borderColor: theme.dark ? '#ffffff10' : '#00000010'}]} key={index}>
              <PressableScale style={[styles.homeworkFile]} weight="light" activeScale={0.9} onPress={() => openURL(file.url)}>
                { file.type == 0 ? (
                  <Link size={20} color={theme.dark ? "#ffffff" : "#000000"} />
                ) : (
                  <File size={20} color={theme.dark ? "#ffffff" : "#000000"} />
                ) }

                <View style={[styles.homeworkFileData]}>
                  <Text style={[styles.homeworkFileText]}>{file.name}</Text>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.homeworkFileUrl]}>{file.url}</Text>
                </View>
              </PressableScale>
            </View>
          )) }
        </View>
      ) : null }
    </PressableScale>
  );
};

const HwCheckbox = ({ checked, theme, pressed }) => {
  return (
    <PressableScale style={[styles.checkContainer, {borderColor: theme.dark ? "#333333" : "#c5c5c5"}, checked ? styles.checkChecked : null]} weight="light" activeScale={0.7} onPress={pressed}>
      { checked ? (
        <Check size={20} color="#ffffff" />
      ) : null }
    </PressableScale>
  );
};

function getNextCours(classes) {
  if (!classes || classes.length === 0) {
    return {
      next: null,
      nextClasses: [],
    };
  }

  const now = new Date(2022, 8, 22);

  const activeClasses = classes.filter(classInfo => !classInfo.is_cancelled);

  let currentOrNextClass = null;
  let minTimeDiff = Infinity;

  for (const classInfo of activeClasses) {
    const startTime = new Date(classInfo.start);
    const endTime = new Date(classInfo.end);

    if (startTime <= now && now <= endTime) {
      currentOrNextClass = classInfo;
      break; // Found the current class, no need to continue
    } else if (startTime > now) {
      const timeDiff = startTime - now;

      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        currentOrNextClass = classInfo;
      }
    }
  }

  if (currentOrNextClass === null) {
    return {
      next: null,
      nextClasses: [],
    };
  }

  const nextClasses = activeClasses.filter(classInfo => {
    const startTime = new Date(classInfo.start);
    return startTime > new Date(currentOrNextClass.start);
  });

  return {
    next: currentOrNextClass,
    nextClasses: nextClasses,
  };
}

const lightenDarkenColor = (color, amount) => {
  let colorWithoutHash = color.replace("#", "")
  if (colorWithoutHash.length === 3) {
    colorWithoutHash = colorWithoutHash
      .split("")
      .map(c => `${c}${c}`)
      .join("")
  }

  const getColorChannel = substring => {
    let colorChannel = parseInt(substring, 16) + amount
    colorChannel = Math.max(Math.min(255, colorChannel), 0).toString(16)

    if (colorChannel.length < 2) {
      colorChannel = `0${colorChannel}`
    }

    return colorChannel
  }

  const colorChannelRed = getColorChannel(colorWithoutHash.substring(0, 2))
  const colorChannelGreen = getColorChannel(colorWithoutHash.substring(2, 4))
  const colorChannelBlue = getColorChannel(colorWithoutHash.substring(4, 6))

  return `#${colorChannelRed}${colorChannelGreen}${colorChannelBlue}`
}

function HomeHeader({ navigation, timetable, user }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [nextCourse, setNextCourse] = React.useState(null);
  const [leftCourses, setLeftCourses] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNextCourses = () => {
      if (timetable !== null) {
        const { next, nextClasses } = getNextCours(timetable);
        setNextCourse(next);
        setLeftCourses(nextClasses);
        setLoading(false);
      }
    };

    fetchNextCourses();
    const interval = setInterval(fetchNextCourses, 300);
    return () => clearInterval(interval);
  }, [timetable]);

  const getColorCoursBg = color => {
    return lightenDarkenColor(getClosestColor(color), -20);
  };

  const getPrenom = name => {
    const words = name.split(' ');
    let prenom = words[words.length - 1];

    for (let i = 1; i < words.length; i++) {
      if (words[i][0] === words[i][0].toUpperCase()) {
        prenom = words[i];
        break; // No need to continue
      }
    }

    return prenom;
  };

  const openProfile = () => {
    if (user) {
      navigation.navigate('Profile', { isModal: true });
    }
  };

  const openNextCours = () => {
    if (nextCourse && nextCourse.id !== null) {
      navigation.navigate('Lesson', { event: nextCourse });
    } else {
      navigation.navigate('CoursHandler');
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: nextCourse ? getColorCoursBg(nextCourse.background_color) : '#29947A', paddingTop: insets.top + 13, borderColor: theme.dark ? '#ffffff15' : '#00000032', borderBottomWidth: 1 }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerNameText}>Bonjour{user ? ', ' + getPrenom(user.name) + ' !' : ' !'}</Text>
        <Text style={styles.headerCoursesText}>{timetable && leftCourses && timetable.length > 1 ? `Il te reste ${leftCourses.length + 1} cours dans ta journée.` : 'Tu n\'as aucun cours restant aujourd\'hui.'}</Text>

        {user && (
          <TouchableOpacity style={[styles.headerPfpContainer]} onPress={openProfile}>
            <Image source={{ uri: user.profile_picture }} style={[styles.headerPfp]} />
          </TouchableOpacity>
        )}
      </View>

      {nextCourse && nextCourse.id !== null && <NextCours cours={nextCourse} navigation={navigation} />}

      {!loading && !nextCourse ? (
        <PressableScale style={[styles.nextCoursContainer, { backgroundColor: theme.dark ? '#151515' : '#ffffff' }, styles.nextCoursLoading]} onPress={openNextCours}>
          <Text style={[styles.nextCoursLoadingText]}>Pas de prochain cours</Text>
        </PressableScale>
      ) : loading ? (
        <PressableScale style={[styles.nextCoursContainer, { backgroundColor: theme.dark ? '#151515' : '#ffffff' }, styles.nextCoursLoading]}>
          <ActivityIndicator size={12} />
          <Text style={[styles.nextCoursLoadingText]}>Chargement du prochain cours</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

function NextCours({ cours, navigation }) {
  const theme = useTheme();
  const [time, setTime] = React.useState("...");

  const lz = (number) => {
    return number < 10 ? '0' + number : number;
  };

  const calculateTimeLeft = date => {
    const now = new Date(2022, 8, 22);
    const start = new Date(date);
    const diff = start - now;

    if (diff > 0) {
      const diffMinutes = Math.floor(diff / 1000 / 60);
      const diffSeconds = Math.floor((diff / 1000) % 60);

      if (diffMinutes < 20) {
        return `dans ${lz(diffMinutes)} min ${lz(diffSeconds)} sec`;
      } else {
        return `dans ${Math.ceil(diffMinutes / 60)}h ${lz(diffMinutes % 60)} min`;
      }
    } else {
      return "maintenant";
    }
  };

  React.useEffect(() => {
    const start = new Date(cours.start);
    setTime(calculateTimeLeft(start));

    const interval = setInterval(() => {
      setTime(calculateTimeLeft(start));
    }, 1000);
    return () => clearInterval(interval);
  }, [cours.start]);

  const openCours = () => {
    navigation.navigate('Lesson', { event: cours });
  };

  const isTimeSet = time !== "...";

  return (
    cours && (
      <PressableScale style={[styles.nextCoursContainer, { backgroundColor: getClosestColor(cours.background_color) }]} onPress={openCours}>
        <View style={styles.nextCoursLeft}>
          <View style={styles.nextCoursEmoji}>
            <Text style={styles.nextCoursEmojiText}>{getClosestGradeEmoji(cours.subject.name)}</Text>
          </View>
          <View style={styles.nextCoursLeftData}>
            <Text numberOfLines={1} style={styles.nextCoursLeftDataText}>
              {formatCoursName(cours.subject.name)}
            </Text>
            <Text numberOfLines={1} style={styles.nextCoursLeftDataTextRoom}>
              salle {cours.rooms[0]} - avec {cours.teachers[0]}
            </Text>
          </View>
        </View>
        <View style={styles.nextCoursRight}>
          <Text numberOfLines={1} style={styles.nextCoursRightTime}>
            à {new Date(cours.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </Text>

          {isTimeSet ? (
            <Text numberOfLines={1} style={styles.nextCoursRightDelay}>
              {time}
            </Text>
          ) : (
            <Text numberOfLines={1} style={styles.nextCoursRightDelay}>
              fin {new Date(cours.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
      </PressableScale>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
  },

  header : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#29947A',
  },

  ListTitle: {
    paddingLeft: 16,
    fontSize: 15,
    fontFamily: 'Papillon-Medium',
    opacity: 0.5,

    marginTop: 24,
    width: '92%',
  },

  headerContainer: {
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',

    width: '92%',
  },

  headerNameText: {
    fontSize: 17,
    fontFamily: 'Papillon-Medium',
    color: '#ffffff99',
    maxWidth: '85%',
  },
  headerCoursesText: {
    fontSize: 20,
    fontFamily: 'Papillon-Regular',
    color: '#ffffff',
    marginTop: 6,
    marginBottom: 2,
    letterSpacing: -0.1,
    maxWidth: '85%',
  },

  nextCoursContainer: {
    width: '92%',
    height: 68,
    borderRadius: 12,
    borderCurve: 'continuous',

    marginTop: 2,
    marginBottom: -32,

    borderWidth: 0,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: .15,
    shadowRadius: 1,

    flexDirection: 'row',
  },

  nextCoursLoading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  nextCoursLoadingText: {
    fontSize: 15,
    opacity: 0.5,
  },

  nextCoursLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    paddingHorizontal: 14,
    paddingVertical: 12,

    gap: 14,
  },
  nextCoursEmoji: {
    width: 42,
    height: 42,
    borderRadius: 24,
    backgroundColor: '#ffffff10',
    borderColor: '#ffffff25',
    borderWidth: 1,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCoursEmojiText: {
    fontSize: 22,
  },

  nextCoursLeftData: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 2,
    flex: 1,
  },
  nextCoursLeftDataText: {
    fontSize: 18,
    fontFamily: 'Papillon-Semibold',
    color: '#ffffff',
    flex: 1,
    marginTop: 2,
  },
  nextCoursLeftDataTextRoom: {
    fontSize: 15,
    color: '#ffffff99',
    flex: 1,
  },

  nextCoursRight: {
    width: '35%',

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',

    paddingHorizontal: 16,
    paddingVertical: 12,

    backgroundColor: '#ffffff10',
    borderLeftWidth: 1,
    borderLeftColor: '#ffffff25',

    gap: 0,

    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  nextCoursRightTime: {
    fontSize: 17,
    fontFamily: 'Papillon-Semibold',
    color: '#ffffff',
    flex: 1,
    marginTop: 3,

    letterSpacing: 0.5,
  },
  nextCoursRightDelay: {
    fontSize: 15,
    color: '#ffffff99',
    flex: 1,
    fontVariant: ["tabular-nums"],
  },

  nextCoursInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCoursInfoText: {
    fontSize: 15,
    opacity: 0.5,
  },

  nextClassesList: {
    width: '92%',

    borderRadius: 12,
    borderCurve: 'continuous',
  },

  nextClassesListItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
  },
  nextClassesListItemEmoji: {
    fontSize: 20,
    marginHorizontal: 7,
  },
  nextClassesListItemText: {
    fontSize: 17,
    fontFamily: 'Papillon-Semibold',
    flex: 1,
    marginTop: 2,
  },
  nextClassesListItemTime: {
    fontSize: 15,
    opacity: 0.5,
    marginLeft: 10,
  },

  headerPfpContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  headerPfp: {
    width: 36,
    height: 36,
    borderRadius: 24,
    backgroundColor: '#ffffff10',
    borderColor: '#ffffff25',
    borderWidth: 1,
  },

  hwList: {
    gap: 0,
    flex: 1,
    width: '92%',
    marginTop: 12,
    borderRadius: 12,
    borderCurve: 'continuous',
  },
  homeworkItemContainer: {
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },

  homeworkItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 16,

    flexDirection: 'row',
  },

  checkboxContainer: {
    
  },
  checkContainer: {
    width: 26,
    height: 26,
    borderRadius: 16,
    borderCurve: 'continuous',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
  },
  checkChecked: {
    backgroundColor: '#159C5E',
    borderColor: '#159C5E',
  },

  hwItem: {
    gap: 4,
    flex: 1,
  },

  hwItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  hwItemColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderCurve: 'continuous',
  },

  hwItemTitle: {
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'Papillon-Semibold',
    opacity: 0.4,
    letterSpacing: 0.7,
  },

  hwItemDescription: {
    fontSize: 17,
    fontWeight: 400,
    fontFamily: 'Papillon-Medium',
  },

  homeworkFileContainer: {
    borderTopWidth: 1,
  },
  homeworkFile: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  homeworkFileData: {
    gap: 2,
    flex: 1,
  },

  homeworkFileText: {
    fontSize: 17,
    fontWeight: 400,
    fontFamily: 'Papillon-Semibold',
  },
  homeworkFileUrl: {
    fontSize: 15,
    fontWeight: 400,
    fontFamily: 'Papillon-Medium',
    opacity: 0.5,
  },

  noHomework: {
    fontSize: 17,
    fontWeight: 400,
    fontFamily: 'Papillon-Medium',
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 12,
  },

  latestGradesList: {
    gap: 14,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  smallGradeContainer: {
    borderRadius: 14,
    borderCurve: 'continuous',
    width: 220,
    paddingBottom: 42,
    overflow: 'hidden',
  },

  smallGradeSubjectContainer: {
    gap : 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  smallGradeEmoji: {
    fontSize: 20,
  },
  smallGradeSubject: {
    fontSize: 15,
    fontFamily: 'Papillon-Semibold',
    color: '#FFFFFF',
    width: '82%',
  },

  smallGradeNameContainer: {
    flex: 1,
    gap: 3,
    marginHorizontal: 16,
  },
  smallGradeName: {
    fontSize: 17,
    fontFamily: 'Papillon-Semibold',
  },
  smallGradeDate: {
    fontSize: 15,
    opacity: 0.5,
  },

  smallGradeValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
    
    position: 'absolute',
    bottom: 14,
    left: 16,
  },
  smallGradeValue: {
    fontSize: 17,
    fontFamily: 'Papillon-Semibold',
  },
  smallGradeOutOf: {
    fontSize: 15,
    opacity: 0.5,
  },
});

export default HomeScreen;