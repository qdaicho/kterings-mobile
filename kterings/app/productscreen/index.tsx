import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  Alert,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import BackButton from '@/components/common/BackButton';
import Minus from '@assets/images/minus.svg';
import Plus from '@assets/images/plus.svg';
import KBottomButton from '@/components/common/KBottomButton';
import * as SecureStore from 'expo-secure-store';

interface UserFoodReview {
  reviewText: string;
  author: string;
  rating: number;
}

interface qImage {
  id: string;
  food_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Quantity {
  id: string;
  food_id: string;
  size: 'small' | 'medium' | 'large';
  price: string;
  quantity: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Food {
  id: string;
  kterer_id: number;
  name: string;
  description: string;
  ingredients: string;
  halal: string;
  kosher: boolean;
  vegetarian: string;
  desserts: string;
  contains_nuts: boolean;
  meat_type: string;
  ethnic_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  auto_delivery_time: number;
  images: qImage[];
  quantities: Quantity[];
  rating: number;
}

interface Review {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  rating: number;
  review: string;
  created_at: string;
  images: string[];
}

interface KtererProfile {
  id: string;
  user_id: string;
  is_verified: number;
  admin_verified: number;
  stripe_account_id: string | null;
  profile_image_url: string;
  bio: string;
  ethnicity: string;
  experienceUnit: string | null;
  experienceValue: string | null;
  street_address: string;
  city: string;
  apartment: string;
  province: string;
  country: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  door_dash_business_id: string;
  door_dash_store_id: string;
}


const RadioButton = ({ label, isSelected, onPress }: { label: string, isSelected: boolean, onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={styles.radioButton}>
      <View
        style={[
          styles.radioButtonOuter,
          isSelected && styles.radioButtonOuterSelected,
        ]}
      >
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.radioButtonText}>{label}</Text>
    </Pressable>
  );
};

const ProductScreen = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [prod, setProd] = useState<Food[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserReview, setSelectedUserReview] = useState<Review>();
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const { image, name, category, distance, rating, id } = useLocalSearchParams();
  const [isAddPressed, setIsAddPressed] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [customerReviews, setCustomerReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('small');
  const [quantities, setQuantities] = useState({ small: 0, medium: 0, large: 0 });
  const [totalPrice, setTotalPrice] = useState(0);
  const [kterer, setKterer] = useState<KtererProfile[]>();


  const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const calculateTotalPrice = () => {
    return ['small', 'medium', 'large'].reduce((total, size) => {
      const quantityObj = prod[0]?.quantities.find((item) => item.size === size);
      if (quantityObj) {
        const price = parseFloat(quantityObj.price);
        const quantity = quantities[size as keyof typeof quantities];
        return total + (price * quantity);
      }
      return total;
    }, 0);
  };

  const extractTags = (item: Food): string[] => {
    const tags: string[] = [];

    if (item.halal && item.halal !== 'None' && item.halal !== 'false')
      tags.push(capitalize(item.halal));
    if (item.kosher) tags.push('Kosher');
    if (
      item.vegetarian &&
      item.vegetarian !== 'None' &&
      item.vegetarian !== 'false'
    )
      tags.push(capitalize(item.vegetarian));
    if (
      item.desserts &&
      item.desserts !== 'None' &&
      item.desserts !== 'false'
    )
      tags.push(capitalize(item.desserts));
    if (item.contains_nuts) tags.push('Contains_nuts');
    if (
      item.meat_type &&
      item.meat_type !== 'None' &&
      item.meat_type !== 'false'
    )
      tags.push(capitalize(item.meat_type));
    if (
      item.ethnic_type &&
      item.ethnic_type !== 'None' &&
      item.ethnic_type !== 'Desserts' &&
      item.ethnic_type !== 'false'
    )
      tags.push(capitalize(item.ethnic_type));

    return tags;
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [quantities, prod]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/food`);
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        const productData = products.data.filter((item: Food) => item.id === id)[0];
        setProd([productData]);
        setTags(extractTags(productData));

        let token = await SecureStore.getItemAsync('token');

        const userReviewsResponse = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/food/reviews/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userReviewsResponse.ok) throw new Error('Network response was not ok');
        const userReviews = await userReviewsResponse.json();
        setCustomerReviews(userReviews.data);
        // console.log(userReviews);

        console.log(token);
        
        const ktererProfile = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/kterer/53`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!ktererProfile.ok) throw new Error('Network response was not ok');
        const kterer = await ktererProfile.json();
        
        console.log(kterer);
        setKterer(kterer.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  // const imageSource = typeof image === 'string' ? { uri: image } : image;

  if (!image || !name || !category || !distance || !rating) return null;

  const renderRating = () => (
    <>
      {Array.from({ length: parseInt(rating as string) }, (_, index) => (
        <FontAwesome key={index} name="star" size={16} style={styles.starIcon} />
      ))}
      <Text style={styles.rating}>{rating} ({customerReviews.length})</Text>
    </>
  );

  const renderUserRating = (rating = 5, size = 10) => {
    const numericRating = typeof rating === 'string' ? parseInt(rating, size) : rating;
    const formattedRating = numericRating.toFixed(1);
    const stars = Array.from({ length: Math.floor(numericRating) }, (_, index) => (
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
    const numericRating = typeof rating === 'string' ? parseInt(rating, 10) : rating;
    const formattedRating = numericRating.toFixed(1);
    const stars = Array.from({ length: Math.floor(numericRating) }, (_, index) => (
      <FontAwesome key={index} name="star" size={12} style={styles.starIcon} />
    ));
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {stars}
        <Text style={{ ...styles.rating, fontSize: 12 }}>{formattedRating} (30+)</Text>
      </View>
    );
  };

  const handleSizeSelection = (size: 'small' | 'medium' | 'large') => {
    setSelectedSize(size);
  };

  const incrementQuantity = () => {
    const maxQuantity = parseInt(prod[0]?.quantities.find((item) => item.size === selectedSize)?.quantity || '0');
    setQuantities((prevQuantities) => {
      if (prevQuantities[selectedSize] < maxQuantity) {
        return { ...prevQuantities, [selectedSize]: prevQuantities[selectedSize] + 1 };
      }
      return prevQuantities;
    });
  };

  const decrementQuantity = () => {
    setQuantities((prevQuantities) => {
      if (prevQuantities[selectedSize] > 0) {
        return { ...prevQuantities, [selectedSize]: prevQuantities[selectedSize] - 1 };
      }
      return prevQuantities;
    });
  };

  const imageSource: ImageSourcePropType | undefined = 
    Array.isArray(image) ? undefined : typeof image === 'string' ? { uri: image } : image;


  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} buttonStyle={styles.backButton} />
      
      <Image source={imageSource} style={styles.image} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              source={require('@assets/images/profile_picture.png')}
              style={{ width: 300, height: 200, borderRadius: 5 }}
            />
            <Text style={{ ...styles.modalText, width: 300, textAlign: 'center', padding: 10 }}>
              {selectedUserReview?.review}
            </Text>
            <Text style={{ fontFamily: 'TT Chocolates Trial Bold', fontSize: 14, marginBottom: 10 }}>
              {selectedUserReview?.user.first_name} {selectedUserReview?.user.last_name}
            </Text>
            <View style={{ marginBottom: 10 }}>{renderUserRating(selectedUserReview?.rating, 14)}</View>
            <View style={{ height: 0.5, backgroundColor: '#969696', marginBottom: 10, width: 300 }}></View>
            <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}
            >
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
        }}
      >
        <Pressable onPress={() => setCartModalVisible(!cartModalVisible)} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <View style={styles.cartModalView}>
            <Text style={styles.cartModalText}>Item Added to Cart</Text>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>Total Price: ${totalPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.ratingContainer}>{renderRating()}</View>
      <Text style={styles.subtitle}>{category} • {distance}</Text>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.description}>
              {prod[0]?.description}
            </Text>
            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredientsTitle}>Ingredients</Text>
              <Text style={styles.ingredients}>{prod[0]?.ingredients}</Text>
            </View>
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>Tags</Text>
              <View style={styles.tagsRow}>
                {tags.map((item, index) => (
                  <View key={index} style={styles.tags}>
                    <Text style={styles.tagsText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
              <FlatList
                data={customerReviews}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable onPress={() => { setModalVisible(true); setSelectedUserReview(item); }}>
                    <View style={styles.reviewContainer}>
                      <Image source={require('@assets/images/profile_picture.png')} style={styles.reviewImage} />
                      <View style={styles.reviewTextContainer}>
                        <Text style={styles.reviewText} numberOfLines={3} ellipsizeMode="tail">
                          {item.review}
                        </Text>
                        <View style={styles.reviewRatingContainer}>
                          <Text style={styles.reviewAuthor}>{item.user.first_name} {item.user.last_name}</Text>
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
              <View style={styles.sellerInfo}>
                <Image source={require('@assets/images/profile_picture.png')} style={styles.sellerImage} />
                <View style={styles.sellerDetails}>
                  <Text style={styles.sellerName}>Bakery</Text>
                  <Pressable onPress={() => router.navigate({ pathname: '/sellerpage/' })}>
                    <Text style={styles.seeMore}>See More Items</Text>
                  </Pressable>
                </View>
                <View style={styles.sellerRating}>
                  {renderSellerRating(1)}
                </View>
              </View>
            </View>
            <View style={styles.optionsAndQuantity}>
              <View style={styles.optionsContainer}>
                <View style={styles.row}>
                  <Text style={styles.label}>Choose a Size</Text>
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>Required</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <RadioButton
                    label="Small"
                    isSelected={selectedSize === 'small'}
                    onPress={() => handleSizeSelection('small')}
                  />
                  <Text style={styles.radioButtonText}>${prod[0]?.quantities.find((item) => item.size === "small")?.price}</Text>
                </View>
                <View style={styles.row}>
                  <RadioButton
                    label="Medium"
                    isSelected={selectedSize === 'medium'}
                    onPress={() => handleSizeSelection('medium')}
                  />
                  <Text style={styles.radioButtonText}>${prod[0]?.quantities.find((item) => item.size === "medium")?.price}</Text>
                </View>
                <View style={styles.row}>
                  <RadioButton
                    label="Large"
                    isSelected={selectedSize === 'large'}
                    onPress={() => handleSizeSelection('large')}
                  />
                  <Text style={styles.radioButtonText}>${prod[0]?.quantities.find((item) => item.size === "large")?.price}</Text>
                </View>
              </View>
              <View style={styles.quantityContainer}>
                <View style={styles.quantityBox}>
                  <View style={styles.requiredBadge}>
                    <Text style={styles.requiredText}>Required</Text>
                  </View>
                  <Text style={styles.quantityText}>{quantities[selectedSize]}</Text>
                </View>
                <View style={styles.quantityControls}>
                  <Pressable onPress={decrementQuantity}>
                    <Minus width={30} height={30} />
                  </Pressable>
                  <Text style={styles.quantityLabel}>Qty</Text>
                  <Pressable onPress={incrementQuantity}>
                    <Plus width={30} height={30} />
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          <KBottomButton title="Add to Cart" onPress={() => setCartModalVisible(true)} />
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
    borderColor: '#E9E9E9',
    borderWidth: 1,
    borderBottomWidth: 3,
    padding: 10,
    maxWidth: 300,
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
    flexShrink: 1,
    justifyContent: 'space-between',
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
  sellerInfo: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  sellerDetails: {
    marginLeft: 10,
    flexDirection: 'column',
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
  sellerRating: {
    marginLeft: 'auto',
  },
  optionsAndQuantity: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginHorizontal: 20,
  },
  optionsContainer: {
    flex: 0.6,
    height: 'auto',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
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
    alignItems: 'center',
  },
  requiredText: {
    fontSize: 8,
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#FFFFFF',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  radioButtonText: {
    marginLeft: 10,
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 12,
  },
  quantityContainer: {
    flex: 0.4,
    height: 'auto',
  },
  quantityBox: {
    backgroundColor: 'rgba(191,30,46,0.08)',
    borderRadius: 10,
    flexDirection: 'column',
    padding: 20,
    alignItems: 'center',
  },
  quantityText: {
    marginTop: 20,
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 30,
  },
  quantityControls: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginTop: 5,
  },

  textStyle: {
    color: '#2196F3',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 16,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'TT Chocolates Trial Medium',
    fontSize: 12,
    marginTop: 20,
  },
  cartModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#49CE1B',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(106,106,106,0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    paddingHorizontal: 40,
    paddingVertical: 20,
    marginBottom: 100,
  },
  cartModalText: {
    fontFamily: 'TT Chocolates Trial Medium',
    color: '#000000',
    fontSize: 14,
  },

  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonOuterSelected: {
    borderColor: '#BF1E2E',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#BF1E2E',
  },
});

export default ProductScreen;
