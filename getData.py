import csv
import urllib.request

url = "https://docs.google.com/spreadsheets/d/1KbfaAJWFMcO_7bRDyS1VPJxIh6Vclr4Ply2F4RsoYEY/pub?output=csv"
response = urllib.request.urlopen(url, "rt", )
cr = csv.reader(response)

def getRawData():
    first = True
    rawData = []

    for row in cr:
        if first:
            first = False
        else:
            bid = (row[1], row[2], row[3])
            rawData.append(bid)

    return rawData



def main():
    print(getRawData())


if __name__ == '__main__':
    main()
