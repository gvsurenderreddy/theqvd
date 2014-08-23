/*
 * Copyright 2009-2014 by Qindel Formacion y Servicios S.L.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU GPL version 3 as published by the Free
 * Software Foundation
 *
 */

#import <Foundation/Foundation.h>
#import "QVDParentUIViewController.h"
#import "QVDError.h"
#import "QVDClientWrapper.h"
#import "QVDViewServices.h"

@interface QVDShowVmController : QVDParentUIViewController <QVDConnectionProgressHandler, UIWebViewDelegate>

@property (weak, nonatomic) IBOutlet UIWebView *novncwebview;



@end
