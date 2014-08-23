/*
 * Copyright 2009-2014 by Qindel Formacion y Servicios S.L.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU GPL version 3 as published by the Free
 * Software Foundation
 *
 */

#import <UIKit/UIKit.h>
#import "QVDParentUIViewController.h"
#import "QVDClientWrapper.h"
#import "QVDService.h"

@interface QVDVMListController : QVDParentUIViewController <QVDCertificateExceptionHandler,UIAlertViewDelegate,QVDServiceStateUpdate>

@property (weak, nonatomic) IBOutlet UILabel *vmlistlabel;
@property (weak, nonatomic) IBOutlet UIActivityIndicatorView *vmlistActivityIndicator;

@end
