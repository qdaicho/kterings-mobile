import { View, Text, StyleSheet, Image, ImageSourcePropType, Pressable, Dimensions, Modal, Alert } from 'react-native';
import BackButton from '@/components/common/BackButton';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { categories } from '@/assets/categories';
import { user_food_reviews } from '@/assets/user_food_reviews';
import { FlatList } from 'react-native-gesture-handler';
import React, { useMemo, useState } from 'react';
// import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import RadioButton from '@components/common/RadioButton';
import Minus from '@assets/images/minus.svg';
import Plus from '@assets/images/plus.svg';
interface UserFoodReview {
  reviewText: string;
  author: string;
  rating: number;
  // Add other properties if needed
}

const ProductScreen = () => {
  // const radioButtons: RadioButtonProps[] = useMemo(() => ([
  //   {
  //     id: '1', // acts as primary key, should be unique and non-empty string
  //     label: 'Option 1',
  //     value: 'option1',

  //   },
  //   {
  //     id: '2',
  //     label: 'Option 2',
  //     value: 'option2'
  //   }
  // ]), []);

  const [selectedId, setSelectedId] = useState<string | undefined>();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserReview, setSelectedUserReview] = useState<UserFoodReview | null>(null);
  const [cartModalVisible, setCartModalVisible] = useState(false);


  const { image, name, category, distance, rating } = useLocalSearchParams();

  const img = image as ImageSourcePropType;

  if (!image || !name || !category || !distance || !rating) {
    return null;
  }

  const renderRating = () =>
    typeof rating === 'string' ? (
      <>
        {Array.from({ length: parseInt(rating) }, (_, index) => (
          <FontAwesome key={index} name="star" size={16} style={styles.starIcon} />
        ))}
        <Text style={styles.rating}>{rating} (30+)</Text>
      </>
    ) : (
      <>
        {rating.map((item, index) => (
          <FontAwesome key={index} name="star" size={16} style={styles.starIcon} />
        ))}
        {rating.map((item, index) => (
          <Text key={index} style={styles.rating}>{item}  (30+)</Text>
        ))}
      </>
    );


  const renderUserRating = (rating = 5, size = 10) => {
    // Ensure the rating is a number, converting from string if needed
    const numericRating = typeof rating === 'string' ? parseInt(rating, size) : rating;

    // Ensure the rating has one decimal place
    const formattedRating = numericRating.toFixed(1);

    // Create the star icons based on the integer part of the numeric rating
    const wholeStars = Math.floor(numericRating);
    const stars = Array.from({ length: wholeStars }, (_, index) => (
      <FontAwesome key={index} name="star" size={size} style={styles.starIcon} />
    ));

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {stars}
        <Text style={{ ...styles.rating, fontSize: size }}>{formattedRating}</Text>
      </View>
    );
  };

  const renderSellerRating = (rating = 5) => {
    // Ensure the rating is a number, converting from string if needed
    const numericRating = typeof rating === 'string' ? parseInt(rating, 10) : rating;

    // Ensure the rating has one decimal place
    const formattedRating = numericRating.toFixed(1);

    // Create the star icons based on the integer part of the numeric rating
    const wholeStars = Math.floor(numericRating);
    const stars = Array.from({ length: wholeStars }, (_, index) => (
      <FontAwesome key={index} name="star" size={12} style={styles.starIcon} />
    ));

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {stars}
        <Text style={{ ...styles.rating, fontSize: 12 }}>{formattedRating} (30+)</Text>
      </View>
    );
  };

  const [isAddPressed, setIsAddPressed] = useState(false); // State to track if the button is pressed

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} buttonStyle={styles.backButton} />
      <Image source={img} style={styles.image} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={require('@assets/images/profile_picture.png')}
              style={{ width: 300, height: 200, borderRadius: 5 }}
            />
            <Text
              style={{
                ...styles.modalText,
                width: 300, // Constrain the text width to the image width
                textAlign: 'center', // Optional: Align the text within the given width
                padding: 10, // Optional: Add padding for spacing
              }}
            >
              {selectedUserReview?.reviewText}
            </Text>

            <Text style={{ fontFamily: 'TT Chocolates Trial Bold', fontSize: 14, marginBottom: 10 }}>{selectedUserReview?.author}</Text>
            <View style={{ marginBottom: 10 }}>{renderUserRating(selectedUserReview?.rating, 14)}</View>

            <View style={{ height: 0.5, backgroundColor: '#969696', marginBottom: 10, width: 300 }}></View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={cartModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <Pressable onPress={() => setCartModalVisible(!cartModalVisible)} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <View style={{
            // // flex: 1,

            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#49CE1B', // Border color
            borderWidth: 1, // Border width
            borderRadius: 10, // Border radius
            backgroundColor: '#FFFFFF', // Background color
            shadowColor: 'rgba(106,106,106,0.5)', // Shadow color in rgba format
            shadowOffset: { width: 0, height: 2 }, // Offset for the shadow
            shadowOpacity: 1, // Opacity for the shadow
            shadowRadius: 4, // Shadow spread,
            alignContent: 'center',
            paddingHorizontal: 40,
            height: 'auto',
            width: 'auto',
            paddingVertical: 20,
            marginBottom: 100
          }}>
            <Text style={{ fontFamily: 'TT Chocolates Trial Medium', color: '#000000', fontSize: 14 }}>Item Added to Cart</Text>
          </View>
        </Pressable>
      </Modal>


      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      <View style={styles.ratingContainer}>{renderRating()}</View>
      <Text style={styles.subtitle}>{category} • {distance}</Text>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.description}>
              Indulge in a breakfast (or dessert) masterpiece: Our Heavenly Stack of Fluffy Pancakes are like little pillows of happiness ready to melt in your mouth.
            </Text>
            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredientsTitle}>Ingredients</Text>
              <Text style={styles.ingredients}>All-purpose flour, baking powder, sugar, butter, and egg</Text>
            </View>
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>Tags</Text>
              <View style={styles.tagsRow}>
                {categories.map((item, index) => (
                  <View key={index} style={styles.tags}>
                    <Text style={styles.tagsText}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsTitle}>Reviews</Text>

              <FlatList
                data={user_food_reviews}
                horizontal={true} // Horizontal scroll
                showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
                renderItem={({ item }) => (
                  <Pressable onPress={() => { setModalVisible(true); setSelectedUserReview(item) }}>
                    <View style={styles.reviewContainer}>
                      <Image source={require('@assets/images/profile_picture.png')} style={styles.reviewImage} />
                      <View style={styles.reviewTextContainer}>
                        <Text style={styles.reviewText} numberOfLines={3} ellipsizeMode="tail">
                          {item.reviewText}
                        </Text>
                        <View style={styles.reviewRatingContainer}>
                          <Text style={styles.reviewAuthor}>{item.author}</Text>
                          <View style={styles.reviewRatingInnerContainer}>
                            {renderUserRating(item.rating)}
                          </View>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                )}
              />
            </View>

            <View style={styles.sellerSection}>
              <Text style={styles.sellerTitle}>Made By</Text>
              <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('@assets/images/bakery.png')} style={{ width: 60, height: 60, borderRadius: 20 }} />
                <View style={{ marginLeft: 10, flexDirection: 'column' }}>
                  <Text style={styles.sellerName}>Bakery</Text>
                  <Pressable onPress={() => { router.navigate({ pathname: '/sellerpage/' }) }}><Text style={styles.seeMore}>See More Items</Text></Pressable>
                </View>
                <View style={{ marginLeft: 'auto' }}>
                  {renderSellerRating(5)}
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginHorizontal: 20 }}>
              <View style={styles.optionsContainer}>
                {/* Row 1 */}
                <View style={styles.row}>
                  <Text style={styles.label}>Choose a Size</Text>
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>Required</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <RadioButton label="Small" size={10} innerColor={'#BF1E2E'} outerColor={'#BF1E2E'} />
                    <Text style={{ marginLeft: 10, fontFamily: 'TT Chocolates Trial Medium', fontSize: 12 }}>Small</Text>
                  </View>
                  <Text style={{ marginLeft: 10, fontFamily: 'TT Chocolates Trial Medium', fontSize: 12 }}>Free</Text>
                </View>

                {/* Row 2 */}
                <View style={styles.row}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <RadioButton label="Small" size={10} innerColor={'#BF1E2E'} outerColor={'#BF1E2E'} />
                    <Text style={{ marginLeft: 10, fontFamily: 'TT Chocolates Trial Medium', fontSize: 12 }}>Medium</Text>
                  </View>
                  <Text style={{ marginLeft: 10, fontFamily: 'TT Chocolates Trial Medium', fontSize: 12 }}>+ $1</Text>
                </View>

                {/* Row 3 */}
                <View style={styles.row}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <RadioButton label="Small" size={10} innerColor={'#BF1E2E'} outerColor={'#BF1E2E'} />
                    <Text style={{ marginLeft: 10, fontFamily: 'TT Chocolates Trial Medium', fontSize: 12 }}>Large</Text>
                  </View>
                  <Text style={{ marginLeft: 10, fontFamily: 'TT Chocolates Trial Medium', fontSize: 12 }}>+ $2</Text>
                </View>
              </View>

              <View style={styles.quantityContainer}>
                <View style={{
                  backgroundColor: 'rgba(191,30,46,0.08)',
                  borderRadius: 10,
                  flexDirection: 'column',
                  padding: 20,
                  alignItems: 'center',
                  height: 'auto',
                  flex: 0.6
                }}>
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>Required</Text>
                  </View>
                  <Text style={{ marginTop: 20, fontFamily: 'TT Chocolates Trial Medium', fontSize: 30 }}>2</Text>
                </View>

                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', flex: 0.4, alignItems: 'center' }}>
                  <Minus width={30} height={30} />
                  <Text style={{ fontFamily: 'TT Chocolates Trial Medium', fontSize: 12 }}>Qty</Text>
                  <Plus width={30} height={30} />
                </View>



              </View>
            </View>

          </>
        }
        ListFooterComponent={
          <Pressable
          onPress={() =>{setCartModalVisible(true)}}
            onPressIn={() => setIsAddPressed(true)} // When button is pressed
            onPressOut={() => setIsAddPressed(false)} // When button is released
          >
            <View style={[{
              backgroundColor: '#D00024',
              height: 80,
              width: Dimensions.get('window').width,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10
            }, isAddPressed ? styles.buttonPressed : null,]}>
              <Text style={[{
                color: '#FFFFFF',
                fontFamily: 'TT Chocolates Trial Bold',
                fontSize: 20,
                fontWeight: '800',
                letterSpacing: 0,
                lineHeight: 38,
                textAlign: 'center',
              }, isAddPressed ? styles.textPressed : null]}>Add to Cart</Text>
            </View>
          </Pressable>

        }
        data={undefined}
        renderItem={undefined}
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 30,
    top: 60,
    zIndex: 2,
  },
  image: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'TT Chocolates Trial Bold',
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'TT Chocolates Trial Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#969696',
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'TT Chocolates Trial Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 10,
  },
  starIcon: {
    color: '#FFBF00',
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    color: '#969696',
    fontFamily: 'TT Chocolates Trial Medium',
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    color: '#000000',
    marginHorizontal: 30,
    marginTop: 30,
    fontFamily: 'TT Chocolates Trial Medium',
  },
  ingredientsContainer: {
    marginHorizontal: 30,
    marginTop: 30,
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Bold',
  },
  ingredients: {
    fontSize: 11,
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Medium',
    marginTop: 10,
  },
  tagsContainer: {
    marginHorizontal: 30,
    marginTop: 30,
    marginBottom: 10,
  },
  tagsTitle: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Bold',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  tags: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginRight: 15,
    height: 40,
    backgroundColor: '#FFEEEE',
    borderColor: '#FFFFFF',
  },
  tagsText: {
    fontSize: 11,
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Medium',
  },
  reviewsSection: {
    marginHorizontal: 30,
    marginTop: 30,
  },
  reviewsTitle: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Bold',
  },

  reviewContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 20,
    elevation: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowRadius: 10,
    borderRadius: 10,
    borderColor: "#E9E9E9",
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: 10,
    maxWidth: 250,
    marginRight: 20,
  },
  reviewImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
  },
  reviewTextContainer: {
    flexDirection: 'column',
    flexShrink: 1,    // Ensures text doesn't shrink too much,
  },
  reviewText: {
    fontSize: 10,
    fontFamily: 'TT Chocolates Trial Regular',
    color: '#000000',
  },
  reviewAuthor: {
    fontSize: 10,
    fontFamily: 'TT Chocolates Trial Bold',
    color: '#000000',
  },
  reviewRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  reviewRatingInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  sellerSection: {
    marginHorizontal: 30,
    marginTop: 30,
  },
  sellerTitle: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Bold',
  },
  sellerName: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'TT Chocolates Trial Medium',
    marginTop: 10,
  },
  seeMore: {
    fontSize: 12,
    color: '#BF1E2E',
    fontFamily: 'TT Chocolates Trial Medium',
    marginTop: 10,

  },

  optionsContainer: {
    marginTop: 20,
    flex: 0.6,
    // width: '60%',
    height: 'auto',
    backgroundColor: 'rgba(191,30,46,0.08)',
    borderRadius: 10,
    // marginHorizontal: 30,
    // marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontFamily: 'TT Chocolates Trial Bold',
  },
  requiredBadge: {
    backgroundColor: '#BF1E2E',
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
    // width:'auto',
    // height: 'auto',
  },
  requiredText: {
    fontSize: 8,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#FFFFFF',
  },
  quantityContainer: {
    marginTop: 20,
    flex: 0.4,
    // width: '60%',
    height: 'auto',

    // marginHorizontal: 30,
    // marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(242,242,242,0.96)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 5
  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
  },
  buttonClose: {
    // backgroundColor: '#2196F3',
  },
  textStyle: {
    color: '#2196F3',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 16
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 12,
    marginTop: 20
  },
  buttonPressed: {
    backgroundColor: '#EFEFF0', // Color when pressed
  },
  textPressed: {
    color: '#969696', // Text color when pressed
  },
});

export default ProductScreen;
