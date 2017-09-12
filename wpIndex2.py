"""
Edge cases to still worry about / needs to be addressed (maybe not in this file or in python but somewhere):

- if a player submits a bid twice for a player with a different value we need to only accept the most recent one
- if two teams tie for a player, we could give to to the lower ranked team, or we could do it by whoever submitted their
bid first. Either works.
- ...Probably some more that I haven't thought of yet.

"""

teamPoints = {"The Capaliers": [0, 0], \
              "Balladega Nights": [0, 0], \
              "The Empire Snipes Back": [0, 0], \
              "The Tagalongs": [0, 0], \
              "Great Balls of Fire": [0, 0], \
              "Whitecaps": [0, 0], \
              "Cap 'n Crunch": [0, 0], \
              "Block-A-Doodle-Doo": [0, 0], \
              "Ball Fondlers": [0, 0], \
              "21 Juke Street": [0, 0], \
              "Blockwork Orange": [0, 0], \
              "Soviet Ballers": [0, 0], \
              "Ball or Nothing": [0, 0], \
              "Bad News Balls": [0, 0], \
              "Gate Registration": [0, 0], \
              "X6TENCE": [0, 0], \
              "Jukes and Cats": [0, 0], \
              "Warden and the Inmates": [0, 0], \
              "Pequenos Pandas": [0, 0], \
              "ThunderCaps": [0, 0], \
              "Black Flag": [0, 0], \
              "877-CAPSNOW": [0, 0], \
              "True Weeaballs Only": [0, 0], \
              "Salt City": [0, 0], \
              "Mo Money Mo Poplems": [0, 0], \
              "Insane Cap Posse": [0, 0], \
              "Ghostboosters": [0, 0], \
              "Circular Logic": [0, 0]}


def getPoints(teamName):
    return teamPoints[teamName][0] + teamPoints[teamName][1] * 100


# TAGUP: team name = string, amount = tuple(normal WP, 100's WP)
def addPoints(teamName, amount):
    teamPoints[teamName][0] += amount[0]
    teamPoints[teamName][1] += amount[1]


def subtractPoints(teamName, amount):
    teamPoints[teamName][0] -= amount[0]
    teamPoints[teamName][1] -= amount[1]

def fixBids(smallBidList):  # List of tuples (teamName, normal bid amount, 100's bid amount)

	for bid in smallBidList:
		teamName = bid[0]
		normalBidAmount = bid[1]
		hundredsAmount = bid[2]
		onHand = getPoints(teamName)

	if (normalBidAmount < 0):
		bidAmount = 0  # negative bid
	if (hundredsAmount < 0):
		hundredsAmount = 0


	if (normalBidAmount > teamPoints[teamName][0]):
		normalBidAmount = teamPoints[teamName][0] # bidded too many normal points
	if hundredsAmount > teamPoints[teamName][1]:
		hundredsAmount = teamPoints[teamName][1]


def getPoints(teamName):
    return teamPoints[teamName][0] + teamPoints[teamName][1] * 100


def processBids(rawBids,): # Assume rawBids is a list of arrays{[team name, player name, bidAmount]}
	fixBids(rawBids)
	rawBids = sorted(rawBids, key = lambda x: x[2], reverse = True)
	bidDict = createDict(rawBids)
	successfulBids = dict()
	while(bool(bidDict)):
		successfulBids[rawBids][0][1] = (rawBids[0][0], rawBids[0][2]) # rawBids[0][1] is player name
		pName = successfulBids[rawBids][0][1]
#		bidDict[rawBids][0][1] = sorted(bidDict[rawBids][0][1], key = lambda j: j[1]+ j[2]*100, reverse = True)
#		subtractPoints(bidDict[rawBids][0][1], (bidDict[rawBids][0][0],
		del bidDict[rawBids[0][1]]
		rawBids[:] = [k for k in rawBids if not rawBids[k][1] == pName]
		fixBids(rawBids)
		rawBids = sorted(rawBids, key = lambda x: x[2], reverse = True)
	return successfulBids


def createBidDictionary(rawBids):  # Assume rawBids is a list of arrays {[team name, player name, bidAmount]}
    # initalize bid dict
    bidDict = dict()

    for bid in rawBids:
        normalAmount = rawBids[2]
        hundredsAmount = 0
        if normalAmount >= 100 and teamPoints[rawBids[0]][1] > 0:
            count = teamPoints[rawBids[0]][1]
            while count > 0 and normalAmount > 100:
                hundredsAmount += 1
                normalAmount -= 100
                count -= 1

        # if the key exists, then add the bid to the list already there
        if bid[1] in bidDict:
            bidDict[bid[1]].append((bid[0], normalAmount, hundredsAmount))
        # else, create a new key-value pair for the player
        else:
            bidDict[bid[1]] = [(bid[0], normalAmount, hundredsAmount)]

    return bidDict


#def processBids(bidDict):
#    successfulBids = dict()
#    for bid in bidDict:  # bid is key (player name), values are list of tuples (team Name, normal bid amount, 100s bid amount)
#        fixBids(bidDict[bid])  # eliminate bad bids
#        bidDict[bid] = sorted(bidDict[bid], key=lambda x: x[1] + x[2] * 100,
#                              reverse=True)  # Sorts each bid list by value, descending order

        # the key to the successful bid dictionary shouldn't be a list
        #successfulBids[bid] = (

        # The key is the player name
        # the value is a tuple (team name, bid amount)
#        successfulBids[bid[0][1]] = (bidDict[bid][0][0], bidDict[bid][0][2] + bidDict[bid][0][3] * 100)
#        subtractPoints(bidDict[bid][0][0], (bidDict[bid][0][2], bidDict[bid][0][3]))
        # subtract points from teamPoints dictionary. bidDict[bid][0][0] is the winning team name, bidDict[bid][0][1] is the winning point amount
#    return successfulBids  # returns successful bids, key is player name, value is tuple (team name, bid amount)

#def findSuccessfulBids(rawBids):
#    return processBids(createBidDictionary(rawBids))


def main():
    pass


if __name__ == '__main__':
    main()