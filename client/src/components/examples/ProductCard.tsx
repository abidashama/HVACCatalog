import ProductCard from '../products/ProductCard'
import pressureSwitchImage from '@assets/generated_images/Pressure_switch_product_photo_6632abba.png'

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="lf5532-auto"
        title="LF5532 Automatic Reset Pressure Switch"
        modelNumber="LF5532-AUTO-24V"
        image={pressureSwitchImage}
        price={89.99}
        originalPrice={109.99}
        category="Pressure Switches"
        series="LF55 Series"
        stockStatus="in_stock"
        rating={4.5}
        reviewCount={24}
        specifications={{
          workingTemp: '-40°C to 120°C',
          pressure: '0.5-16 bar',
          voltage: '24V AC/DC',
          connection: '1/4" NPT'
        }}
      />
    </div>
  )
}