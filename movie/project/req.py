import requests

def getDiscountedPrice(barcode):
    params={'barcode':barcode}
    r=requests.get('https://jsonmock.hackerrank.com/api/inventory', params=params)
    #print(r.json())
    dict=r.json()
    if not dict['data']:
        return -1
    else:
        print(dict['data'])
        data=dict['data']
        print(data[0])
        price = data[0].get('price')
        discount=data[0].get('discount')
        disc_price=price-((discount/100)*price)
        return disc_price
    return

if __name__ == '__main__':
    getDiscountedPrice(74001777)