  let icon,
	    iconRiv,
      urlIcon,
      urlIconRiv,
	    turn,
	    turnCount = 1,
	    arr = [],
	    i,
	    j,
	    k,
	    countOnes = 0,	
	    countTwos = 0,	
	    posZero,
	    expPos,
	    res,
	    prior,
	    rndCell,
	    cornerCells = [],
	    cornerCell = false,
	    cornerPos,
	    msg,
	    skip,
	    skipPos = false,
      confirmTurn = true;

	function drawField() {
		for (i = 1; i <= 3; i++) {
			let pos = String.fromCharCode(64 + i);
			for (let j = 1; j <= 3; j++) {
				$(".gameField").append(`<div class='cell'></div>`);
		    	}	
		}		
	}

	function randomInteger(min, max){
	  return Math.floor(min + Math.random() * (max + 1 - min));
	}

	function setCornerCell() {
		rndCell = cornerCells[Math.floor(Math.random()*cornerCells.length)];		
		addIcon(rndCell);		
	}

	function getArr() {
		arr = [];
		for (i = 1; i <= 9; i++) {
			if($(`.cell:nth-child(${i})`).hasClass(`marked-${icon}`)) {
				arr.push(1);
			} else if($(`.cell:nth-child(${i})`).hasClass(`marked-${iconRiv}`)) {
				arr.push(2);
			} else {
				arr.push(0);
			}
		}
		return arr;
	}

  function clearField() {
		$(".cell").each(function() {
			$(this).hasClass('marked-cross') ? $(this).removeClass("marked-cross") :        $(this).removeClass("marked-zero");
			$(this).css("background", "none");
		});
	}

	function addIcon(k, msg) {		
		$(".c_turn").slideDown();
		$(`.cell:nth-child(${k})`).css("background", `url(${urlIconRiv}) center center no-repeat`).addClass(`marked-${iconRiv}`);
		confirmTurn = true;
		$(".c_turn").slideUp(function() {
			if(!msg) {
				$(".h_turn").slideDown();
			} else {
				$(".resMessage").text(msg);
				$(".resMessage").show();
				setTimeout(clearField, 2000);
				setTimeout(function() {
					$(".resMessage").hide();
					$(".pic").show();
				}, 2000);
			}			
		});		
	}

	function setCell() {
		if (posZero > 0) {
			if(turn == 1) {
				if (countOnes == 2 && posZero > 0) {
					skip = true;
					return posZero;					
				}
				if(countTwos == 2 && countOnes == 0) {					
					msg = "You lost";
					addIcon(posZero, msg);				
					return true;
				}			
				if(countTwos == 1 && countOnes == 0) {
					prior = 1;				
					return posZero;
				}
				if(countOnes == 1 && countTwos == 0 && prior < 1) {				
					return posZero;
				}				
			} else {
				if(countTwos == 2 && countOnes == 0) {
					msg = "You lost";
					addIcon(posZero, msg);										
					return true;																				
				}
				if(countTwos == 1 && countOnes == 1 && turnCount == 4) {
					msg = "It's a draw";
					addIcon(posZero, msg);										
					return true;
				}			
			}
		}		
		return false;		
	}

	function checkFDiag() {
		countOnes = 0;
		posZero = 0;
		countTwos = 0;		
		for (i = 0; i < 9; i += 4) {									
			switch(arr[i]) {
				case 1:
						++countOnes;
						break;
				case 2:
						++countTwos;
						break;
				case 0:
					posZero = i + 1;
					break;
			}																		
		}
	}

	function checkSDiag() {
		countOnes = 0;
		posZero = 0;
		countTwos = 0;		
		for (i = 2; i < 8; i += 2) {									
			switch(arr[i]) {
				case 1:
						++countOnes;
						break;
				case 2:
						++countTwos;
						break;
				case 0:
					posZero = i + 1;
					break;
			}																		
		}
	}

	function checkRows() {				
		for (i = 0; i < 9; i += 3) {
			countOnes = 0;
			posZero = 0;
			countTwos = 0;			
			for(j = i; j < (i + 3); j++) {
				if(arr[j] == 1) {
					++countOnes;
					continue;
				}
				if(arr[j] == 0) {
					posZero = j + 1;
					continue;
				}
				if(arr[j] == 2) {
					++countTwos;																						
				}																			
			}								
			res = setCell();
			if(res === true) {
				return true;
			} else if(res !== false) {
				if(skip) {
					skipPos = res;
					skip = false;
				} else {
					expPos = res;
				}							
			} 						
		}
		if(skipPos) {			
			return skipPos;
		}
		if(expPos) {			
			return expPos;
		}
		return false;
	}

	function checkCols() {		
		for (i = 0; i < 3; i++) {
			countTwos = 0;
			posZero = 0;
			countOnes = 0;
			for(j = i; j < 9; j += 3) {
				switch(arr[j]) {
					case 1:
						++countOnes;
						break;
					case 2:
						++countTwos;
						break;
					case 0:
						posZero = j + 1;
				}										
			}
			res = setCell();			
			if(res === true) {
				return true;
			} else if(res !== false) {
				if(skip) {
					skipPos = res;
					skip = false;
				} else {
					expPos = res;
				}			
			}
		}
		if(skipPos) {			
			return skipPos;
		}
		if(expPos) {			
			return expPos;
		}
		return false;
	}

	function checkDiags() {
		checkFDiag();
		res = setCell();
		if(res === true) {
			return true;
		} else if(res !== false) {
			if(skip) {
				skipPos = res;
			} else {
				expPos = res;
			}			
		}
		checkSDiag();
		res = setCell();
		if(res === true) {
			return true;
		} else if(res !== false) {
			if(skip) {
				skipPos = res;
			} else {
				expPos = res;
			}			
		}
		if(skipPos) {			
			return skipPos;
		}
		if(expPos) {			
			return expPos;
		}
		return false;
	}
	
	$(".symbol").on("click", function() {
		if($(this).hasClass("cross")) {
			icon = "cross";
			iconRiv = "zero";
      urlIcon = "https://dl.dropboxusercontent.com/s/7x761r6adzvf3kn/X.png?dl=0";
      urlIconRiv = "https://dl.dropboxusercontent.com/s/tlj24tfxswm0kwu/O.png?dl=0";
		} else {
			icon = "zero";
			iconRiv = "cross";
      urlIcon = "https://dl.dropboxusercontent.com/s/tlj24tfxswm0kwu/O.png?dl=0";
      urlIconRiv = "https://dl.dropboxusercontent.com/s/7x761r6adzvf3kn/X.png?dl=0";
		}
    
		$(".pic").slideUp(500, function() {
			drawField();
			turn = randomInteger(1,2);

			if(turn == 2) {
				addIcon(5);
			}

			$(".cell").on("click", function() {
				if(!$(this).hasClass("marked-cross") && !$(this).hasClass("marked-zero") && confirmTurn) {
					$(this).css("background", `url(${urlIcon}) center center no-repeat`).addClass(`marked-${icon}`);
					confirmTurn = false;					
					$(".h_turn").slideUp(function() {	
					//get array from gameField values
					arr = getArr();            
					if(arr.indexOf(0) == -1) {
						msg = "It's a draw";
						addIcon(-1, msg);
					}					
							
					if(turnCount == 1) {
						cornerCells = [1, 3, 7, 9];
						if(turn == 1) {
							$(".c_turn").slideDown();
							arr[4] == 1 ? setCornerCell() : addIcon(5);
							$(".c_turn").slideUp(function() {
								$(".h_turn").slideDown();
							});									
						} else {							
							for (i = 0; i < 4; i++) {
								if(arr[cornerCells[i] - 1] == 1) {
									cornerPos = cornerCells[i];
									switch(cornerCells[i]) {
										case 1:													
										case 3:
											addIcon(2);
											break;
										case 7:
										case 9:
											addIcon(8);
											break;
									}
									cornerCell = true;
									break;
								}										
							}

							if(!cornerCell) {
								switch(arr.indexOf(1)) {
									case 1:
									case 3:
										addIcon(1);
										cornerPos = 1;
										break;
									case 5:
									case 7:
										addIcon(9);
										cornerPos = 9;
										break;
								}
							}
						}
					} else {
						if(turnCount == 2) {
							msg = false;
							//check rows
							res = checkRows();
							if(res === true) {
								prior = 0;
								expPos = 0;
								skipPos = 0;
								turnCount++;									
								return;
							} 

							//check columns
							res = checkCols();
							if(res === true) {
								prior = 0;
								expPos = 0;
								skipPos = 0;
								turnCount++;									
								return;
							}

							//check diagonals
							res = checkDiags();								
							if(res === true) {
								prior = 0;
								expPos = 0;
								skipPos = 0;
								turnCount++;									
								return;
							}

							if (turn == 2) {
								if(cornerCell) {										
									switch(cornerPos) {
										case 1:
											addIcon(7);
											break;
										case 3:
											addIcon(9);
											break;
										case 7:
											addIcon(1);
											break;
										case 9:
											addIcon(3);
											break;
									}
									turnCount++;	
									return;
								}	else {									
									switch(cornerPos) {
										case 9:
											if (arr[7] == 0) {
												addIcon(8);
											} else {
												addIcon(6);
											}													
											break;													
										case 3:
											if (arr[1] == 0) {
												addIcon(2);
											} else {
												addIcon(6);
											}													
											break;
										case 7:
											if (arr[3] == 0) {
												addIcon(4);
											} else {
												addIcon(8);
											}													
											break;
										case 1:
											if (arr[1] == 0) {
												addIcon(2);
											} else {
												addIcon(4);
											}													
											break;
									}
									turnCount++;	
									return;
								}										
							} else {
								if(skipPos) {
									addIcon(skipPos);
									prior = 0;
									expPos = 0;
									skipPos = 0;
									turnCount++;
									return;
								}
								if(arr[1] == 1 && arr[3] == 1) {
									addIcon(1);
									turnCount++;	
									return;
								} else if (arr[1] == 1 && arr[5] == 1) {
									addIcon(3);
									turnCount++;	
									return;
								} else if (arr[7] == 1 && arr[5] == 1) {
									addIcon(9);
									turnCount++;	
									return;
								} else if (arr[7] == 1 && arr[3] == 1) {
									addIcon(7);
									turnCount++;	
									return;
								} else if((arr[2] == 1 && arr[6] == 1) || (arr[0] == 1 && arr[8] == 1)) {
									addIcon(2);
									turnCount++;	
									return;
								} else {
									for (i = 0; i < 4; i++) {
										if(arr[cornerCells[i] - 1] == 1) {
											continue;
										} else {
											addIcon(cornerCells[i]);
											++turnCount;
											return;
										}										
									}
								}										
							}
						} else if(turn == 2 && turnCount == 3) {

							if(checkDiags()) {
								prior = 0;
								expPos = 0;
								skipPos = 0;
								turnCount++;										
								return;
							}									

							if(cornerCell) {										
								addIcon(4);
								prior = 0;
								expPos = 0;
								skipPos = 0;
								turnCount++;
								return;
							} 
						} 
						//check rows
						res = checkRows();
						if(res === true) {
							prior = 0;
							expPos = 0;
							skipPos = 0;
							turnCount++;									
							return;
						} else if(res !== false) {
							expPos = res;
						}

						//check columns
						res = checkCols();
						if(res === true) {
							prior = 0;
							expPos = 0;
							skipPos = 0;
							turnCount++;									
							return;
						}

						//check diagonals
						res = checkDiags();								
						if(res === true) {
							prior = 0;
							expPos = 0;
							skipPos = 0;
							turnCount++;									
							return;
						}

						if(skipPos) {									
							addIcon(skipPos);
							prior = 0;
							expPos = 0;
							skipPos = 0;
							turnCount++;
							return;
						}

						if(expPos) {									
							addIcon(expPos);
							prior = 0;
							expPos = 0;
							skipPos = 0;
							turnCount++;
							return;
						}
					}
					turnCount++;							
					});
				}
			});				
		});
	});				

		$(document).ready(function() {	
			$(".pic").show();
		});
