import { useState, useRef, useEffect } from 'react'
import './Home.css'

const Home = () => {
  const [productCode, setProductCode] = useState('')
  const [productData, setProductData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // Added a loading state
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onSubmitData = (e) => {
    e.preventDefault()

    if (!productCode) {
      setError('Please enter a product code.')
      return
    }

    setLoading(true) // Start loading
    setError('')
    setProductData(null)

    const apiUrl = import.meta.env.VITE_API_URL

    fetch(`${apiUrl}/api/sheet?code=${productCode}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Product not found')
        }
        return res.json()
      })
      .then((data) => {
        setProductData(data) // Assign the fetched object directly
        console.log(data, 'product data')
      })
      .catch((err) => {
        console.error(err)
        setError('Product not found. Please try again.')
      })
      .finally(() => {
        setLoading(false) // Stop loading, regardless of success or failure
      })
  }

  return (
    <div className='card' role='region' aria-label='Quote'>
      <form onSubmit={onSubmitData}>
        <div className='top'>
          <div className='left-entry'>
            <div className='label'>Enter Product Code</div>
            <input
              ref={inputRef}
              type='text'
              placeholder='Enter Code'
              className='input-like'
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
            />
          </div>
          <button type='submit' disabled={loading} className='search-button'>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
        )}

        {/* Display content based on states */}
        {loading && (
          <div className='content loading'>
            <p>Loading product data...</p>
          </div>
        )}

        {!loading && productData && (
          <div className='content'>
            <div className='title'>
              QUOTE FOR PRODUCT
              <span style={{ fontWeight: 900, marginLeft: '8px' }}>
                {productData.code}
              </span>
            </div>

            <div className='rows'>
              <div className='row'>
                <div className='label'>Gross Weight</div>
                <span className='details-span'>{productData[2][1]}</span>
              </div>
              <div className='row'>
                <div className='label'>Less Weight</div>
                <span className='details-span'>{productData[3][1]}</span>
              </div>
              <div className='row'>
                <div className='label'>Net Weight</div>
                <span className='details-span'>{productData[4][1]}</span>
              </div>
              <div className='row'>
                <div className='label'>Rate as on Today</div>
                <span className='details-span'>{productData[5][1]}</span>
              </div>
              <div className='row'>
                <div className='label'>Making %</div>
                <span className='details-span'>{productData[6][1]}</span>
              </div>
              <div className='row'>
                <div className='label'>Spl MC</div>
                <span className='details-span'>{productData[7][1]}</span>
              </div>
            </div>

            <div className='divider' aria-hidden='true'></div>

            <div className='total'>
              <div>Total Est Price (in INR)</div>
              <span className='details-span'>{productData[8][1]}</span>
            </div>
          </div>
        )}

        <div className='bottom'>
          <div className='barcode' aria-hidden='true'></div>
          <span className='tag-text'>
            {productData ? productData[9][1] : ''}
          </span>
        </div>
      </form>
    </div>
  )
}

export default Home
