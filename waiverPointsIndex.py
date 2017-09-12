


teamPoints = {"The Capaliers": [0,0], "Balladega Nights": [0,0], "The Empire Snipes Back": 0, "The Tagalongs": [0,0], "Great Balls of Fire": [0,0], "Whitecaps": [0,0], "Cap 'n Crunch": [0,0], "Block-A-Doodle-Doo": [0,0], "Ball Fondlers": [0,0], "21 Juke Street": [0,0], "Blockwork Orange": [0,0], "Soviet Ballers": [0,0], "Ball or Nothing": [0,0], "Bad News Balls": [0,0], "Gate Registration": [0,0], "X6TENCE": [0,0], "Jukes and Cats": [0,0], "Warden and the Inmates": [0,0], "PequeÃ±os Pandas": [0,0], "ThunderCaps": [0,0], "Black Flag": [0,0], "877-CAPSNOW": [0,0], "True Weeaballs Only": [0,0], "Salt City": [0,0], "Mo Money Mo Poplems": [0,0], "Insane Cap Posse": [0,0], "Ghostboosters": [0,0], "Circular Logic": [0,0]}


def getPoints(teamName):
	return teamPoints[teamName][0] + teamPoints[teamName][1]*100


def addPoints(teamName, amount):
	teamPoints[teamName][1] += amount/100
	teamPoints[teamName][0] += amount%100

def subtractPoints(teamName, amount):
	if(amount < teamPoints[teamName][0]):
		teamPoints[teamName][0] -= amount
	else:
		teamPoints[teamName][1] -= amount/100
		teamPoints[teamName][0] -= amount%100


def fixBids(smallBidList): # List of tuples (teamName, bid amount)

	for bid in smallBidList:
		teamName = bid[0]
		bidAmount = bid[1]
		onHand = getPoints(teamName)
		if(bidAmount < 0):
			bidAmount = 0 # negative bid
		elif(bidAmount > onHand):
			bidAmount = onHand #bid too much
		else:
			if(teamPoints[teamName][1] != 0):
				if((bidAmount - teamPoints[teamName][1]*100) > teamPoints[teamName][0]):
					bidAmount = teamPoints[teamName][0] + teamPoints[teamName][1]*100 # If a team has 10 WPs and a +100 and they bid 50 WPs on a player, change to 10 WPs




def createBidDictionary(rawBids): # Assume rawBids is a list of arrays {[team name, player name, bid amount]}
	bidDict = dict()
	for elt in rawBids:
		bidDict[elt][1].append((elt[0], elt[2]))  # Dictionary should have a bunch of tuples now, with key being the player name and the values being a series of tuples (team name, bid amount)
	return bidDict # unsorted


def processBids(bidDict):
	successfulBids = dict()
	for bid in bidDict: # bid is key (player name), values are list of tuples (team Name, bid Amount)
		fixBids(bidDict[bid]) # eliminate bad bids
		bidDict[bid] = sorted(bidDict[bid], key=lambda x: x[1], reverse = True) # Sorts each bid list by value, descending order
		successfulBids[bid] = (bidDict[bid][0][0], bidDict[bid][0][1]) # The first in the list is the team that bid the most
		subtractPoints(bidDict[bid][0][0], bidDict[bid][0][1]) # subtract points from teamPoints dictionary. bidDict[bid][0][0] is the winning team name, bidDict[bid][0][1] is the winning point amount
	return successfulBids # returns successful bids, key is player name, value is tuple (team name, bid amount)


def main():
    pass

if __name__ == '__main__':
    main()